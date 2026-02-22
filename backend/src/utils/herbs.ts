import Groq from "groq-sdk";
import { tavily } from '@tavily/core';
import dotenv from "dotenv";
dotenv.config();

const tav = tavily({ apiKey: process.env.TAVILY_API_KEY!});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  name?: string;
  tool_call?: any;
}

export async function getherbInfo(query: string) {
  const baseMessages: Message[] = [
    {
      role: 'system',
      content: `
        You are an experienced Herbalist.
        If you know the answer to a question, answer it directly in plain English.
        If the answer requires real-time, local, or up-to-date information, or if you don’t know the answer, use the available tools to find it.
        You have access to the following tool:

        webSearch(query: string): Use this to search the internet for current or unknown information.
        Decide when to use your own knowledge and when to use the tool.
        Do not mention the tool unless needed.

        You need to give output in the following manner :-
        {
          "name": "",
          "scientific_name: "",
          "benefits": ["", ""],
          "used_for": ["", ""],
          "preparation": "",
          "safety": ""
        }
        Follow this json format only.
        Do not wrap in markdown.
        Do not explain anything.
        Do not add extra text.

        Examples :-
        Q: Ashwagandha
        A: { 
          "name": "Ashwagandha",
          "benefits": [
            "Stress relief",
            "Immunity boost"
          ],
          "used_for": [
            "Anxiety",
            "Fatigue"
          ],
          "preparation": "Powder with warm milk",
          "safety": "Avoid during pregnancy; may cause drowsiness"
        } 

        Q: Tulsi(Basil Leaf)
        A: {
          "name": "Tulsi (Holy Basil)",
          "benefits": [
            "Respiratory support",
            "Antioxidant"
          ],
          "used_for": [
            "Cough",
            "Cold",
            "Mild fever"
          ],
          "preparation": "Decoction (Kadha) or fresh leaves",
          "safety": "Generally safe; avoid excessive use if trying to conceive"
        },
      `
    },
  ]

  const messages: Message[] = baseMessages;

  messages.push({
    role: 'user',
    content: query,
  });

  const MAX_RETRIES = 10;
  let count = 0;

  while (true) {
    if (count > MAX_RETRIES) {
      return 'I Could not find the result, please try again';
    }
    count++;

    const completions = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
      // @ts-ignore
      messages: messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'webSearch',
            description: 'Search the internet for accurate and up-to-date information about the given herb.',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The herb name to perform search on.',
                },
              },
              required: ['query'],
            },
          },
        },
      ],
      tool_choice: 'auto',
    });

    const message = completions?.choices[0]?.message;

    messages.push({
      role: "assistant",
      content: message?.content ?? "",
      tool_call: message?.tool_calls 
    });

    const toolCalls = completions?.choices[0]?.message.tool_calls;

    if (!toolCalls) {
      return completions?.choices[0]?.message.content;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments
      if (functionName === 'webSearch') {
        const toolResult = await webSearch(JSON.parse(functionParams));
        messages.push({
            tool_call_id: tool.id,
            role: 'tool',
            name: functionName,
            content: toolResult,
        });
      }
    }
    continue;
  }
}

async function webSearch({ query }: { query: string}) {
    console.log('Calling web search...');

    const response = await tav.search(query);

    const finalResult = response.results.map((result) => result.content).join('\n\n');

    return finalResult;
}