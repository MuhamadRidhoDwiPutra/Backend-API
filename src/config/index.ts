import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env["NODE_ENV"] ?? "development",
  port: parseInt(process.env["PORT"] ?? "3000", 10),
  appName: process.env["APP_NAME"] ?? "Backend API",

  database: {
    url: process.env["DATABASE_URL"]!,
  },

  jwt: {
    secret: process.env["JWT_SECRET"] ?? "default-secret",
    expiresIn: process.env["JWT_EXPIRES_IN"] ?? "7d",
  },

  rateLimit: {
    windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] ?? "900000", 10),
    maxRequests: parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] ?? "100", 10),
  },

  cors: {
    origin: process.env["CORS_ORIGIN"] ?? "http://localhost:3000",
  },

  redis: {
    url: process.env["REDIS_URL"] ?? "redis://localhost:6379",
  },

  email: {
    from: process.env["EMAIL_FROM"] ?? "no-reply@example.com",
    host: process.env["SMTP_HOST"] ?? "",
    port: parseInt(process.env["SMTP_PORT"] ?? "587", 10),
    user: process.env["SMTP_USER"] ?? "",
    pass: process.env["SMTP_PASSWORD"] ?? "",
  },

  logging: {
    level: process.env["LOG_LEVEL"] ?? "info",
  },

  bcrypt: {
    saltRounds: parseInt(process.env["BCRYPT_SALT_ROUNDS"] ?? "12", 10),
  },
} as const;