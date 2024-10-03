import jwt from "jsonwebtoken";
import User from "../models/userModel";
import {
  sendVerificationEmail,
  sendPasswordRecoveryEmail,
} from "./emailService";
import { hashPassword, comparePassword } from "../utils/hash";
import crypto from "crypto";
import { config } from "../config/index";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Incorrect email or password.");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Incorrect email or password.");

  if (!user.isVerified)
    throw new Error("Please verify your email to continue.");

  return jwt.sign({ id: user._id.toString() }, config.JWT_SECRET || "", {
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
  if (userExists) throw new Error("Email is already registered.");

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

export const sendPasswordResetEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 3600000);

  await user.save({ validateBeforeSave: false });

  await sendPasswordRecoveryEmail(user.email, token);
};

export const resetUserPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("passo2");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired token.");
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
};
