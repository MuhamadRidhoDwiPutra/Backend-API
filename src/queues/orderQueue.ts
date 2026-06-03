import { Queue } from "bullmq";
import { config } from "../config/index.js";

export const orderQueue = new Queue("order-processing", {
  connection: { url: config.redis.url },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});
