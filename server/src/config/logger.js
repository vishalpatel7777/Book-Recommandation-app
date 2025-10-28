// Optional: Placeholder for a more robust logging solution like Winston or Pino

const logger = {
    info: (message, context) => {
        if (process.env.NODE_ENV !== 'test') {
            console.log(`[INFO] [${new Date().toISOString()}] ${message}`, context);
        }
    },
    error: (message, error) => {
        console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error);
    },
    warn: (message) => {
        console.warn(`[WARN] [${new Date().toISOString()}] ${message}`);
    },
};

module.exports = logger;