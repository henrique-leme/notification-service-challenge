import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { env } from "../server";
import { generateToken } from "../utils/generateToken";

export const verifyEmail = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (user.isVerified) {
      throw new Error("Usuário já está verificado.");
    }

    user.isVerified = true;
    await user.save();

    const authToken = generateToken(user._id.toString());
    return authToken;
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new Error("Token expirado. Solicite um novo email de verificação.");
    }
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      throw new Error("Token inválido.");
    }
    throw new Error("Erro na verificação do token.");
  }
};
