import { SendEmailCommand } from "@aws-sdk/client-ses";
import { config } from "../config/index";
import { generateToken } from "../utils/generateToken";
import sesClient from "../config/awsConfig";

export const sendVerificationEmail = async (email: string, userId: string) => {
  const token = generateToken(userId);

  const verificationLink = `${config.BASE_URL}/api/users/verify-email/${token}`;

  const params = {
    Source: config.EMAIL_FROM,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Confirm Your Email" },
      Body: {
        Text: {
          Data: `Click the link to verify your email: ${verificationLink}`,
        },
      },
    },
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
};

export const sendNotificationEmail = async (
  receivers: string[],
  content: string
) => {
  const params = {
    Source: config.EMAIL_FROM,
    Destination: { ToAddresses: receivers },
    Message: {
      Subject: { Data: "Your Personalized Notification" },
      Body: { Text: { Data: content } },
    },
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
};

export const sendPasswordRecoveryEmail = async (
  email: string,
  resetToken: string
) => {
  const resetLink = `${config.FRONTEND_URL}/reset-password/${resetToken}`;

  const params = {
    Source: config.EMAIL_FROM,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Recover Your Password" },
      Body: {
        Text: {
          Data: `Click the link to reset your password: ${resetLink}`,
        },
      },
    },
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
};
