import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { searchHerb } from "../controllers/herb.controller.js";

const router  = express.Router();

router.post('/ask-herb', isAuth, searchHerb);

export default router;