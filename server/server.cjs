require("dotenv").config(); // Ensure dotenv is loaded first
const logger = require("./src/utils/logger");
const app = require("./src/app.cjs");
const { connectToDb } = require("./conn/index");

const port = process.env.PORT || 1000;

// Start the server only after connecting to the database
async function startServer() {
  try {
    await connectToDb();
    logger.info(`Connected to MongoDB`);

    const server = app.listen(port, () => {
      logger.info(`Server started at http://localhost:${port}`, { port, env: process.env.NODE_ENV || "development" });
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`Received ${signal}, shutting down gracefully`);
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000).unref();
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection", { reason: String(reason) });
    });
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
      process.exit(1);
    });
  } catch (error) {
    logger.error("Fatal Error starting server", { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

startServer();