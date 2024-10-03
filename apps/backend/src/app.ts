import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/api", routes);

export default app;
