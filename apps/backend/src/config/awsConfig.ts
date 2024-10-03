import { SESClient } from "@aws-sdk/client-ses";
import { config } from "./index";

export const sesClient = new SESClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

console.log(`AWS SES Client configured for region: ${config.AWS_REGION}`);

export default sesClient;
