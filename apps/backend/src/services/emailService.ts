import { SendEmailCommand } from "@aws-sdk/client-ses";
import { env, sesClient } from "../server";
import { generateToken } from "../utils/generateToken";

export const sendVerificationEmail = async (email: string, userId: string) => {
  const token = generateToken(userId);

  const verificationLink = `${env.BASE_URL}/api/users/verify-email/${token}`;

  const params = {
    Source: env.EMAIL_FROM,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Confirme seu Email" },
      Body: {
        Text: {
          Data: `Clique no link para verificar seu email: ${verificationLink}`,
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
    Source: env.EMAIL_FROM,
    Destination: { ToAddresses: receivers },
    Message: {
      Subject: { Data: "Sua Notificação Personalizada" },
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
  const resetLink = `${env.BASE_URL}/reset-password?token=${resetToken}`;

  const params = {
    Source: env.EMAIL_FROM,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Recupere sua Senha" },
      Body: {
        Text: {
          Data: `Clique no link para redefinir sua senha: ${resetLink}`,
        },
      },
    },
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
};
