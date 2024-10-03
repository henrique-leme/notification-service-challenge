import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  resetUserPassword,
  sendPasswordResetEmail,
} from "../services/authService";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password);
    res.json({ token, message: "Login successful." });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;

  try {
    await registerUser(name, surname, email, password);
    res.status(201).json({
      message: "User registered successfully. Please check your email.",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    await sendPasswordResetEmail(email);
    res.status(200).json({
      message:
        "If the email exists in our system, we have sent a password reset link to it.",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log("passo");

  try {
    await resetUserPassword(token, password);
    res.status(200).json({ message: "Password successfully reset." });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
