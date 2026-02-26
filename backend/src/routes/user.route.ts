import express from "express";
import { login, me, signup } from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.get('/get-user', isAuth, me);

export default router;