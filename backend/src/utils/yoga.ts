import { groq } from "../config/ai.js";
import { webSearch, type Message } from "./herbs.js";

export async function yogaInfo(query: string) {
  const baseMessages: Message[] = [
    {
      role: "system",
      content: `
        You are an experienced yoga instructor.
        If you know the answer to a question, answer it directly in plain English.
        If the answer requires real-time, local, or up-to-date information, or if you don’t know the answer, use the available tools to find it.

        You have access to the following tool:

        webSearch(query: string): Use this to search the internet for current or unknown information.
        Decide when to use your own knowledge and when to use the tool.
        Do not mention the tool unless needed.
        For images search the web and only give real and authentic sources.
        You need to give answer according the pose name provided or the symptom provided.

        You need to give output in the following manner :-
        {
          "name": "",
          "about_thid_pose": "",
          "precaution_and_contradiction": "",
          "level": "",
          "target_benefit": "",
          "video_url": "",
          "image_url": "",
          "steps": ["", "", ""],
        }

        Follow this json format only.
        Do not wrap in markdown.
        Do not explain anything.
        Do not add extra text.

        Examples :-

        Q: Vajrasana
        A: {
            "name": "Vajrasana (Thunderbolt Pose)",
            "about_this_pose": "Vajrasana is a kneeling posture that alters the flow of blood and nervous impulses in the pelvic region. It is uniquely known as the only yoga posture that can and should be practiced immediately after meals to enhance digestion.",
            "target_benefit": "Improves digestion, prevents acidity, and strengthens pelvic muscles.",
            "precaution_and_contradiction": "Avoid if you have severe knee pain, recent knee or ankle surgery, or slip disc conditions.",
            "level": "Beginner",
            "video_url": "https://media.tenor.com/F9rKPugvM1IAAAA1/eijaz-eijaz-khan.webp",
            "image_url": "https://yogajala.com/wp-content/uploads/2022/11/Yoga-Pose-How-To-Diagrams-26.jpg",
            "steps": [
              "Kneel on the floor with your knees and toes touching.",
              "Sit back on your heels.",
              "Keep your head, neck, and spine completely straight.",
              "Place your palms on your thighs facing downwards.",
              "Close your eyes and breathe deeply and steadily."
            ]
          }

        Q: Sheetali Pranayama
        A: {
            "name": "Sheetali Pranayama (Cooling Breath)",
            "about_this_pose": "Sheetali means 'cooling' in Sanskrit. This breathing technique involves drawing air across a rolled tongue to physically cool the body and calm the nervous system.",
            "target_benefit": "Cools the body, reduces acidity, and calms the nervous system.",
            "precaution_and_contradiction": "Avoid during cold weather, or if suffering from low blood pressure, severe asthma, or respiratory congestion.",
            "level": "Beginner",
            "video_url": "https://media.tenor.com/aJW49KbUcmcAAAA1/moumita-yoga.webp",
            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMxmJrN7KQ0yKJ5b1jResW7eKMXK9qiv0tWg&s",
            "steps": [
              "Sit in a comfortable cross-legged position with your spine straight.",
              "Stick your tongue out slightly and roll the edges inward to form a tube.",
              "Inhale deeply and slowly through the tubular tongue.",
              "Close your mouth and hold your breath for a few seconds.",
              "Exhale slowly through your nose."
            ]
          }
      `,
    },
  ];
  const messages: Message[] = baseMessages;

  messages.push({
    role: "user",
    content: query,
  });

  const MAX_RETRIES = 10;
  let count = 0;

  while (true) {
    if (count > MAX_RETRIES) {
      return "I Could not find the result, please try again";
    }
    count++;

    const completions = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      // @ts-ignore
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the internet for accurate and up-to-date information about the given pose name or symptom name.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "The pose name or symptom name to perform search on.",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const message = completions?.choices[0]?.message;

    messages.push({
      role: "assistant",
      content: message?.content ?? "",
      tool_call: message?.tool_calls,
    });

    const toolCalls = completions?.choices[0]?.message.tool_calls;

    if (!toolCalls) {
      return completions?.choices[0]?.message.content;
    }

    for (const tool of toolCalls) {
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;
      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));
        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
    continue;
  }
}