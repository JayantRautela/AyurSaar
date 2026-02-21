import axios from "axios";
import { type Response } from "express";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const streamGroq = async (
  messages: any[],
  res: Response
): Promise<string | null> => {

  let fullResponse = "";
  let isClosed = false;

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    res.on("close", () => {
      isClosed = true;
      res.end();
    });

    const response = await axios({
      method: "post",
      url: GROQ_URL,
      data: {
        model: "openai/gpt-oss-20b",
        messages,
        temperature: 0.4,
        stream: true,
        response_format: { type: "json_object" }
      },
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      responseType: "stream"
    });

    return await new Promise((resolve, reject) => {

      response.data.on("data", (chunk: Buffer) => {
        if (isClosed) return;

        const lines = chunk.toString().split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const json = line.replace("data:", "").trim();

            if (json === "[DONE]") {
              if (!res.writableEnded) res.end();
              resolve(fullResponse);
              return;
            }

            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices[0]?.delta?.content;

              if (content) {
                fullResponse += content;
                res.write(content);
              }

            } catch {
              // Ignore parse errors
            }
          }
        }
      });

      response.data.on("end", () => {
        if (!res.writableEnded) res.end();
        resolve(fullResponse);
      });

      response.data.on("error", (err: any) => {
        console.error("Stream error:", err);
        if (!res.writableEnded) res.end();
        reject(err);
      });
    });

  } catch (error: any) {
    console.error("Groq API error:");

    if (error.response) {
      const chunks: any[] = [];
      error.response.data.on("data", (chunk: any) => {
        chunks.push(chunk);
      });
      error.response.data.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        console.error("Groq Error Body:", body);
      });
    } else {
      console.error(error.message);
    }
    if (!res.headersSent) {
      res.status(500).json({ message: "Streaming failed" });
    } else {
      if (!res.writableEnded) res.end();
    }

    return null;
  }
};