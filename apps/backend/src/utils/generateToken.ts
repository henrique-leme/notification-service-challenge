import jwt from "jsonwebtoken";
import { env } from "../server";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: "30m" });
};
