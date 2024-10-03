import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password);
    res.json({ token, message: "Login efetuado com sucesso" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;

  try {
    await registerUser(name, surname, email, password);
    res.status(201).json({
      message: "Usuário registrado com sucesso. Verifique seu email.",
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
