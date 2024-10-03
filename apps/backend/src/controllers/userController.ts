import { Request, Response } from "express";
import { verifyEmail } from "../services/userService";

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await verifyEmail(userId);
    res.status(200).json({ message: "Email verificado com sucesso." });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
