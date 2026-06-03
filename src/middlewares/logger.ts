import crypto from "crypto";
import type { IncomingMessage, ServerResponse } from "http";
import { pino } from "pino";
import { pinoHttp } from "pino-http";
import { config } from "../config/index.js";

export const logger = pino({
  level: config.logging.level,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
  base: { service: "backend-api" },
});

export const requestLogger = pinoHttp({
  logger,
  genReqId: () => crypto.randomUUID(),
  customLogLevel: (req: IncomingMessage, res: ServerResponse, err?: Error) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customProps: (req: IncomingMessage, res: ServerResponse) => ({
    traceId: (req as IncomingMessage & { id?: string | number | object }).id,
    route: (req as IncomingMessage & { url?: string }).url,
    method: (req as IncomingMessage & { method?: string }).method,
  }),
});
