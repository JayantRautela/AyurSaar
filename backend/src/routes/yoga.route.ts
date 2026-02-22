import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { getYoga } from "../controllers/yoga.controller.js";

const router  = express.Router();

router.post('/get-yoga', isAuth, getYoga);

export default router;