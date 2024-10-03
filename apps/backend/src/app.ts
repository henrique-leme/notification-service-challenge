import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

app.use("/api", routes);

export default app;
