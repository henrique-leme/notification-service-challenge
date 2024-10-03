import { SESClient } from "@aws-sdk/client-ses";
import app from "./app";
import connectDB from "./config/db";
import validateEnv from "./config/index";

const env = validateEnv();
const sesClient = new SESClient({ region: env.AWS_REGION });

const PORT = env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { sesClient, env };
