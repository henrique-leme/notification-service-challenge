import { Request, Response } from "express";
import { resendVerificationEmail, verifyEmail } from "../services/userService";
import { config } from "../config/index";

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await verifyEmail(userId);
    res.status(200).redirect(`${config.FRONTEND_URL}/login`);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const resendVerificationUserEmail = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  try {
    await resendVerificationEmail(email);
    res.status(201).json({
      message:
        "User verification email was successfully send. Please check your email.",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
