import { type Response } from "express";
import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { buildContext, classifySymptom } from "../utils/ragService.js";
import Conversation from "../models/conversation.model.js";
import { SYSTEM_PROMPT } from "../utils/prompt.js";
import { streamGroq } from "../utils/groq.js";

export const chat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query } = req.body;
    const userId = req.user?._id as unknown as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const symptom = await classifySymptom(query);
    if (!symptom) {
      return res.status(400).json({
        success: false,
        message: "No matching symptom found."
      });
    }

    const context = buildContext(symptom);

    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        messages: []
      });
    }

    conversation.messages.push({
      role: "user",
      content: query,
      timestamp: new Date()
    });
    await conversation.save();

    const limitedHistory = conversation.messages.slice(-6);

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT + "\nContext:\n" + context
      },
      ...limitedHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const fullReply = await streamGroq(messages, res);

    if (fullReply) {
      conversation.messages.push({
        role: "assistant",
        content: fullReply,
        timestamp: new Date()
      });
      await conversation.save();
    }

    return;

  } catch (error) {
    console.error("Error in chat:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    } else {
      res.end();
    }
  }
};