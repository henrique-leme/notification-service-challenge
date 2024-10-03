import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().default("mongodb://localhost:27017"),
  PORT: z.string().regex(/^\d+$/, "PORT must be a number").default("5000"),
  AWS_ACCESS_KEY_ID: z.string().default(""),
  AWS_SECRET_ACCESS_KEY: z.string().default(""),
  AWS_REGION: z.string().default("us-east-1"),
  BASE_URL: z.string().default("http://localhost:5000"),
  JWT_SECRET: z.string().default("secret"),
  EMAIL_FROM: z.string().default("no-reply@example.com"),
  NEWS_API_KEY: z.string().default(""),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

const envVars = envSchema.safeParse(process.env);

if (!envVars.success) {
  console.error(
    "Environment variables validation error:",
    envVars.error.format()
  );
  process.exit(1);
}

export const config = envVars.data;
