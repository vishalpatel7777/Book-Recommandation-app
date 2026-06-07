require("dotenv").config(); // Load .env BEFORE validating
const { z } = require("zod");

const envSchema = z.object({
  PORT: z.coerce.number().default(1000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DB_URI: z.string().min(1, "DB_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),
  EMAIL_USER: z.string().email("EMAIL_USER must be a valid email"),
  EMAIL_PASS: z.string().min(1, "EMAIL_PASS is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables. Server refused to start.\n");
  const issues = parsed.error?.issues ?? [];
  issues.forEach((issue) => {
    console.error(`  [${issue.path.join(".") || "root"}]: ${issue.message}`);
  });
  process.exit(1);
}

module.exports = parsed.data;
