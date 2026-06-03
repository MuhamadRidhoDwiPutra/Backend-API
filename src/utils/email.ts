import * as nodemailer from "nodemailer";
import { config } from "../config/index.js";
import { logger } from "../middlewares/logger.js";

let cachedTransport: any | null = null;

const createTransport = async (): Promise<any> => {
  if (cachedTransport) return cachedTransport;

  if (config.email.host && config.email.user && config.email.pass) {
    cachedTransport = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransport = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return cachedTransport;
};

export const sendInvoiceEmail = async (email: string, subject: string, html: string): Promise<string> => {
  const transport = await createTransport();
  const message = {
    from: config.email.from,
    to: email,
    subject,
    html,
  };

  const info = await transport.sendMail(message);
  logger.info({ email, messageId: info.messageId }, "Invoice email dispatched");

  if (nodemailer.getTestMessageUrl(info)) {
    logger.info({ previewUrl: nodemailer.getTestMessageUrl(info) }, "Invoice preview URL");
    return nodemailer.getTestMessageUrl(info) as string;
  }

  return info.messageId;
};
