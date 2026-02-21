import { type Request, type Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await User.findOne({
      email: email
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword
    });
    newUser.save();

    const token = jwt.sign({ newUser }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: "User signed up",
      token: token
    });
  } catch (error) {
    console.error("Error in signup :- ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await User.findOne({
      email: email
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const verifyPassword = bcrypt.compareSync(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: "User logged in",
      token: token
    });
  } catch (error) {
    console.error("Error in login :- ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}