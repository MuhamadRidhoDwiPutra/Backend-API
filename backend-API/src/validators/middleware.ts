import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import type { IApiResponse } from "../types/index.js";

export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        const response: IApiResponse = {
          success: false,
          message: "Validation Error",
          errors,
        };

        res.status(400).json(response);
        return;
      }
      next(error);
    }
  };

export const validateBody = (schema: ZodSchema) => validate(schema, "body");
export const validateQuery = (schema: ZodSchema) => validate(schema, "query");
export const validateParams = (schema: ZodSchema) => validate(schema, "params");