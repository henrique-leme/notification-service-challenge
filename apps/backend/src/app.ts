import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

export const setupApp = async () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: [
        "*",
        "localhost:3000",
        "http://localhost:3000",
        "https://localhost:3000",
        "https://notification-service-challenge-frontend.vercel.app",
        "notification-service-challenge-frontend.vercel.app",
        "http://notification-service-challenge-frontend.vercel.app",
      ],
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    })
  );
  app.use(helmet());

  app.use("/api", routes);

  return app;
};
