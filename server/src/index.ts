import express from 'express'
import { blobRoutes } from './routes'
import bodyParser from 'body-parser'
import { config } from './config'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

//NOTE: init prisma client
export const prisma = new PrismaClient()

//NOTE: init the server
export const app = express()

app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false }))
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  })
)

app.use(blobRoutes)

app.listen(config.port, () =>
  console.log(`server is running on port: ${config.port}`)
)

// import WebSocket from 'ws'
// export const wss = new WebSocket.Server({ port: 8080 })
// export const ws = new WebSocket('ws://localhost:8080') // Adjust URL if needed
//
// wss.on('connection', (clientWs) => {
//   console.log('Client connected')
//
//   clientWs.on('message', (message) => {
//     // const msgObj = JSON.parse(message.toString())
//     // if (msgObj.progress !== undefined) {
//     //   // Broadcast progress update to all connected clients except the sender
//     //   wss.clients.forEach((client) => {
//     //     if (client !== clientWs && client.readyState === WebSocket.OPEN) {
//     //       client.send(JSON.stringify(msgObj))
//     //     }
//     //   })
//     // }
//   })
//
//   clientWs.on('close', () => {
//     console.log('Client disconnected')
//   })
//   clientWs.on('error', (error) => {
//     console.error('WebSocket error:', error)
//   })
// })
