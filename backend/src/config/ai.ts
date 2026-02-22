import Groq from "groq-sdk";
import { tavily } from '@tavily/core';
import dotenv from "dotenv";
dotenv.config();

export const tav = tavily({ apiKey: process.env.TAVILY_API_KEY!});
export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });