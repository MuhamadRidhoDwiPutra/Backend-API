import client from "prom-client";
import type { Request, Response, NextFunction } from "express";

const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const requestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export const metricsHandler = async (_req: Request, res: Response): Promise<void> => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
};

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const end = requestDuration.startTimer({ method: req.method, route: req.route?.path ?? req.path, status_code: "unknown" });

  res.on("finish", () => {
    const route = req.route?.path ?? req.path;
    const statusCode = res.statusCode.toString();
    requestCounter.inc({ method: req.method, route, status_code: statusCode });
    end({ method: req.method, route, status_code: statusCode });
  });

  next();
};
