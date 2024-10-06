import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { config } from "../config/index";
import { generateToken } from "../utils/generateToken";
import { sendVerificationEmail } from "./emailService";

export const verifyEmail = async (token: string): Promise<string> => {
  try {
    const decoded: any = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.isVerified) {
      throw new Error("User is already verified.");
    }

    user.isVerified = true;
    await user.save();

    const authToken = generateToken(user.id.toString());

    return authToken;
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new Error(
        "Token expired. Please request a new verification email."
      );
    }
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      throw new Error("Invalid token.");
    }
    throw new Error("Error verifying the token.");
  }
};

export const resendVerificationEmail = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("This email does not exist.");

  if (user.isVerified) throw new Error("This account is already verified.");

  await sendVerificationEmail(user.email, user._id.toString());

  return { message: "Verification email has been resent." };
};
