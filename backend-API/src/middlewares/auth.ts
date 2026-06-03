import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/index.js";
import type { IApiResponse } from "../types/index.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const response: IApiResponse = {
      success: false,
      message: "Authentication required",
    };
    res.status(401).json(response);
    return;
  }

  if (!authHeader.startsWith("Bearer ")) {
    const response: IApiResponse = {
      success: false,
      message: "Invalid authorization format. Use: Bearer <token>",
    };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.slice(7);

  if (!token) {
    const response: IApiResponse = {
      success: false,
      message: "Token is required",
    };
    res.status(401).json(response);
    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    const response: IApiResponse = {
      success: false,
      message: "Invalid or expired token",
    };
    res.status(401).json(response);
    return;
  }

  req.user = payload;
  next();
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
};