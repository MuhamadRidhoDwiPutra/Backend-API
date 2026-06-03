import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import { config } from "../config/index.js";
import type { IJwtPayload } from "../types/index.js";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.bcrypt.saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: IJwtPayload): string => {
  const secret: Secret = config.jwt.secret;
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as unknown as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): IJwtPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret as Secret) as IJwtPayload;
  } catch {
    return null;
  }
};

export const decimalToNumber = (value: unknown): number => {
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
};

export const parsePagination = (page?: string, limit?: string) => {
  const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit ?? "10", 10) || 10));
  return { page: pageNum, limit: limitNum };
};