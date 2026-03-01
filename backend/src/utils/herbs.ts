import { groq, tav } from "../config/ai.js";
import type { Message } from "../types/types.js";
import { webSearch } from "./webSearch.js";

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
        For images search the web and only give real and authentic sources.

        You need to give output in the following manner :-
        {
          "name": "",
          "scientific_name: "",
          "benefits": ["", ""],
          "used_for": ["", ""],
          "preparation": "",
          "safety": "",
          "image_url": ""
        }
        Follow this json format only.
        Do not wrap in markdown.
        Do not explain anything.
        Do not add extra text.

        Examples :-
        Q: Ashwagandha
        A: { 
          "name": "Ashwagandha",
          "scientific_name": "Withania somnifera",
          "benefits": [
            "Stress relief",
            "Immunity boost"
          ],
          "used_for": [
            "Anxiety",
            "Fatigue"
          ],
          "preparation": "Powder with warm milk",
          "safety": "Avoid during pregnancy; may cause drowsiness",
          "image_url": "https://www.google.com/imgres?q=ashwagandha&imgurl=https%3A%2F%2Fwww.dabur.com%2FMedical%2520Plants%2FAshwagandha%2520%25281%2529.jpg&imgrefurl=https%3A%2F%2Fwww.dabur.com%2Fayurveda%2Fayurvedic-medicinal-plants%2Fashwagandha&docid=uUz9bU06AEgIUM&tbnid=P3ev-8aYQLkXrM&vet=12ahUKEwiCm67Q1-ySAxU0XWwGHT-JFGkQnPAOegQIERAB..i&w=450&h=450&hcb=2&ved=2ahUKEwiCm67Q1-ySAxU0XWwGHT-JFGkQnPAOegQIERAB"
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
          "safety": "Generally safe; avoid excessive use if trying to conceive",
          "image_url": "https://www.google.com/imgres?q=neem&imgurl=https%3A%2F%2Fwww.dabur.com%2FMedical%2520Plants%2FNeem_1917057650%2520%25283%2529.jpg&imgrefurl=https%3A%2F%2Fwww.dabur.com%2Fayurveda%2Fayurvedic-medicinal-plants%2Fneem&docid=d54pEVo2ilGP6M&tbnid=jKu7NqAJhyURsM&vet=12ahUKEwj_7sPi1-ySAxU8SmwGHWqzH_MQnPAOegQIHRAB..i&w=450&h=450&hcb=2&ved=2ahUKEwj_7sPi1-ySAxU8SmwGHWqzH_MQnPAOegQIHRAB"
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