import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().url("MONGO_URI must be a valid URL"),
  PORT: z.string().regex(/^\d+$/, "PORT must be a number"),
  AWS_ACCESS_KEY_ID: z.string({
    required_error: "AWS_ACCESS_KEY_ID is required",
  }),
  AWS_SECRET_ACCESS_KEY: z.string({
    required_error: "AWS_SECRET_ACCESS_KEY is required",
  }),
  AWS_REGION: z.string({
    required_error: "AWS_REGION is required",
  }),
  BASE_URL: z.string(),
  JWT_SECRET: z.string({
    required_error: "JWT_SECRET is required",
  }),
  EMAIL_FROM: z.string(),
  NEWS_API_KEY: z.string({
    required_error: "NEWS_API_KEY is required",
  }),
  FRONTEND_URL: z.string(),
});

const validateEnv = () => {
  const envVars = {
    MONGO_URI: process.env.MONGO_URI || "",
    PORT: process.env.PORT || "5000",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_REGION: process.env.AWS_REGION || "",
    BASE_URL: process.env.BASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    EMAIL_FROM: process.env.EMAIL_FROM || "",
    NEWS_API_KEY: process.env.NEWS_API_KEY || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "",
  };

  const result = envSchema.safeParse(envVars);

  if (!result.success) {
    console.error(
      "Environment variables validation error:",
      result.error.format()
    );
    process.exit(1);
  }

  return result.data;
};

export default validateEnv;
