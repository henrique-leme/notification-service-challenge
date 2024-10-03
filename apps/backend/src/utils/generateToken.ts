import jwt from "jsonwebtoken";
import { config } from "../config/index";

export const generateToken = (id: string) => {
  return jwt.sign({ id }, config.JWT_SECRET, { expiresIn: "30m" });
};
