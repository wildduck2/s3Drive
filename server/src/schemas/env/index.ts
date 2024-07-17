import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

//NOTE: zod schema for the env vars
const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().url(),
  S3_BUCKET: z.string(),
  S3_REGION: z.string()
})

export const parsedEnv = envSchema.safeParse(process.env)
