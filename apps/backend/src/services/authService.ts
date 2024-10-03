import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { sendVerificationEmail } from "./emailService";
import { env } from "../server";
import { hashPassword, comparePassword } from "../utils/hash";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email ou senha incorretos.");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Email ou senha incorretos.");

  if (!user.isVerified) throw new Error("Verifique seu email para continuar.");

  return jwt.sign({ id: user._id.toString() }, env.JWT_SECRET || "", {
    expiresIn: "30d",
  });
};

export const registerUser = async (
  name: string,
  surname: string,
  email: string,
  password: string
) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email já registrado.");

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    surname,
    email,
    password: hashedPassword,
    isVerified: false,
  });
  await newUser.save();

  await sendVerificationEmail(newUser.email, newUser._id.toString());
};
