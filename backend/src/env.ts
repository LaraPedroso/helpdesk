import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
