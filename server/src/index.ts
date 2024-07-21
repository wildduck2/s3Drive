import express from 'express'
import { authRouter, blobRoutes } from './routes'
import bodyParser from 'body-parser'
import { config } from './config'
import cors from 'cors'
import { PrismaClient } from '../prisma/generated/client'

//NOTE: init prisma client

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-expect-error prisma
  if (!global.prisma) {
    // @ts-expect-error prisma
    global.prisma = new PrismaClient()
  }
  // @ts-expect-error prisma
  prisma = global.prisma
}

export default prisma

//NOTE: init the server
export const app = express()

app.use(bodyParser.json({ limit: '40mb' }))
app.use(bodyParser.urlencoded({ limit: '40mb', extended: false }))
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use(blobRoutes)
app.use(authRouter)

app.listen(config.port, () =>
  console.log(`server is running on port: ${config.port}`)
)
