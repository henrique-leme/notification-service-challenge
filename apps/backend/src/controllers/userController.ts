import { Request, Response } from "express";
import { verifyEmail } from "../services/userService";
import { env } from "../server";

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await verifyEmail(userId);
    res.redirect(`${env.FRONTEND_URL}/login`);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
