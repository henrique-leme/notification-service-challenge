import { Request, Response } from "express";
import { verifyEmail } from "../services/userService";
import { config } from "../config/index";

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await verifyEmail(userId);
    console.log(`${config.FRONTEND_URL}/login`);
    res.status(200).redirect(`${config.FRONTEND_URL}/login`);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
