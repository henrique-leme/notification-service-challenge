import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { config } from "../config/index";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, config.JWT_SECRET || "") as {
        id: string;
      };

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "Usuário não encontrado" });
        return;
      }

      req.user = user;

      return next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido ou expirado" });
      return;
    }
  } else {
    res.status(401).json({ message: "Sem token, autorização negada" });
    return;
  }
};
