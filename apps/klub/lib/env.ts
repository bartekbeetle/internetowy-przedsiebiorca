import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // NextAuth
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters for security"),

  // MailerLite
  MAILERLITE_API_KEY: z.string().min(1, "MAILERLITE_API_KEY is required"),
  MAILERLITE_FROM_EMAIL: z
    .string()
    .email("MAILERLITE_FROM_EMAIL must be a valid email"),

  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables at startup
 * Throws error with clear message if validation fails
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      MAILERLITE_API_KEY: process.env.MAILERLITE_API_KEY,
      MAILERLITE_FROM_EMAIL: process.env.MAILERLITE_FROM_EMAIL,
      NODE_ENV: process.env.NODE_ENV,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => {
        return `  ❌ ${err.path.join(".")}: ${err.message}`;
      });

      console.error("\n🚨 Environment validation failed:\n");
      console.error(missingVars.join("\n"));
      console.error("\nPlease check your .env.local file\n");

      throw new Error("Invalid environment variables");
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * Call validateEnv() once at startup to ensure all vars are valid
 */
export const env = validateEnv();
