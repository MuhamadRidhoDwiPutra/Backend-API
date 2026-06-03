import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import type { IApiResponse } from "../types/index.js";

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      } as IApiResponse);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      } as IApiResponse);
      return;
    }

    next();
  };
};

export const adminOnly = requireRole("ADMIN");
export const customerOnly = requireRole("CUSTOMER");
export const authenticated = requireRole("ADMIN", "CUSTOMER");