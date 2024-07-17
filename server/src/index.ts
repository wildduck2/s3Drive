import express from 'express'
import { parsedEnv } from './schemas'

//NOTE: Checkign for valid zod vars
if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format())
  process.exit(1)
}
export const env = parsedEnv.data

//NOTE: init the server
export const server = express()

server.listen(env?.PORT, () =>
  console.log(`server is running on port: ${env?.PORT}`)
)
