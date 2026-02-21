import axios from "axios";
import { type Response } from "express";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const streamGroq = async (
  messages: any[],
  res: Response
) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  
  const response = await axios({
    method: "post",
    url: GROQ_URL,
    data: {
      model: "llama3-70b-8192",
      messages,
      temperature: 0.4,
      stream: true
    },
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    responseType: "stream"
  });

  response.data.on("data", (chunk: Buffer) => {
    const lines = chunk.toString().split("\n");

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const json = line.replace("data:", "").trim();

        if (json === "[DONE]") {
          res.end();
          return;
        }

        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices[0]?.delta?.content;
          if (content) res.write(content);
        } catch {}
      }
    }
  });
  response.data.on("error", (err: any) => {
    console.error(err);
    res.end();
  });
};
