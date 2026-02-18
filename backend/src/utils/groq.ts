import axios, { type AxiosResponse } from "axios";
import dotenv from "dotenv";
import type { Response } from "express";
import type { Readable } from "stream";
dotenv.config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface StreamChunk {
  choices: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

export const streamGroq = async (messages: Message[], res: Response) => {
  const response: AxiosResponse<Readable> = await axios({
    method: "post",
    url: GROQ_URL,
    data: {
      model: "llama3-70b-8192",
      messages,
      temperature: 0.4,
      stream: true
    },
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    responseType: "stream"
  });

  response.data.on("data", (chunk: StreamChunk) => {
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

          if (content) {
            res.write(content);
          }
        } catch (err) {
          console.error("Streaming parse error", err);
        }
      }
    }
  });
};
