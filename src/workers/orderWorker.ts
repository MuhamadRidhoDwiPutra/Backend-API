import { Worker, QueueEvents } from "bullmq";
import prisma from "../config/database.js";
import { config } from "../config/index.js";
import { sendInvoiceEmail } from "../utils/email.js";
import { logger } from "../middlewares/logger.js";

const queueName = "order-processing";

export const startOrderWorker = (): void => {
  const worker = new Worker(
    queueName,
    async (job) => {
      const { orderId } = job.data as { orderId: string };
      const eventId = `order-${orderId}-invoice`;

      const existingLog = await prisma.activityLog.findUnique({ where: { eventId } });
      if (existingLog?.status === "COMPLETED") {
        logger.info({ orderId, eventId }, "Skipping already processed async order job");
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          items: { include: { product: true } },
        },
      });

      if (!order) {
        throw new Error(`Order ${orderId} not found for background processing`);
      }

      const activityLog = existingLog
        ? await prisma.activityLog.update({
            where: { eventId },
            data: { status: "PROCESSING", retries: { increment: 1 }, errorMessage: null },
          })
        : await prisma.activityLog.create({
            data: {
              eventId,
              orderId: order.id,
              userId: order.userId,
              type: "ORDER_INVOICE",
              payload: {
                orderId: order.id,
                userEmail: order.user.email,
                totalAmount: order.totalAmount.toString(),
              },
              status: "PROCESSING",
            },
          });

      const emailHtml = `<h1>Invoice for Order ${order.id}</h1><p>Total amount: $${order.totalAmount.toString()}</p>`;
      const previewUrl = await sendInvoiceEmail(order.user.email, `Invoice for order ${order.id}`, emailHtml);

      await prisma.notification.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          type: "ORDER_CREATED",
          message: `Order ${order.id} has been processed and invoice delivered.`,
        },
      });

      const existingPayload =
        typeof activityLog.payload === "object" && activityLog.payload !== null
          ? (activityLog.payload as Record<string, unknown>)
          : {};

      await prisma.activityLog.update({
        where: { id: activityLog.id },
        data: {
          status: "COMPLETED",
          processedAt: new Date(),
          payload: {
            ...existingPayload,
            previewUrl,
          },
        },
      });

      logger.info({ orderId, eventId }, "Async order processing completed");
    },
    {
      connection: { url: config.redis.url },
      concurrency: 3,
      lockDuration: 60000,
      autorun: true,
    }
  );

  const queueEvents = new QueueEvents(queueName, { connection: { url: config.redis.url } });

  queueEvents.on("failed", async ({ jobId, failedReason }) => {
    logger.error({ jobId, failedReason }, "Order worker job failed");
  });

  queueEvents.on("completed", async ({ jobId }) => {
    logger.info({ jobId }, "Order worker job completed");
  });

  worker.on("error", (err) => logger.error(err, "Order worker encountered error"));
};
