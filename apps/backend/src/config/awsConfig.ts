import AWS from "aws-sdk";
import validateEnv from "./index";

const env = validateEnv();

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

export default AWS;
