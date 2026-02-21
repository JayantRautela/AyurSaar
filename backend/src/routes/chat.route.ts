import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { chat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post('/ask', isAuth, chat);

export default router;