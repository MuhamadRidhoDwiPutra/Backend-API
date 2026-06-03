import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { config } from "../config/index.js";
import type { IApiResponse } from "../types/index.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (config.env === "development") {
    console.error("Error:", err);
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    } as IApiResponse);
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    } as IApiResponse);
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    const response: IApiResponse = { success: false, message: "Database Error" };

    switch (err.code) {
      case "P2002":
        response.message = "A record with this value already exists";
        break;
      case "P2025":
        response.message = "Resource not found";
        res.status(404);
        break;
      default:
        response.message = "Database operation failed";
    }

    res.status(400).json(response);
    return;
  }

  res.status(500).json({
    success: false,
    message:
      config.env === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  } as IApiResponse);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  } as IApiResponse);
};

export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};