import app from "./app.js";
import { config } from "./config/index.js";
import prisma from "./config/database.js";

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📚 API: http://localhost:${config.port}/api`);
      console.log(`🏥 Health: http://localhost:${config.port}/health`);
      console.log(`⚡ Environment: ${config.env}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

const gracefulShutdown = async (): Promise<void> => {
  console.log("🛑 Shutting down gracefully...");
  try {
    await prisma.$disconnect();
    console.log("✅ Database disconnected");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

startServer();