import { orderQueue } from "../queues/orderQueue.js";

export const enqueueOrderProcessing = async (orderId: string): Promise<void> => {
  await orderQueue.add(
    "order-created",
    { orderId },
    {
      jobId: `order-created-${orderId}`,
    }
  );
};
