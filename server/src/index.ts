import express from 'express'
import { authRouter, blobRoutes } from './routes'
import bodyParser from 'body-parser'
import { config } from './config'
import cors from 'cors'

//NOTE: init the server
export const app = express()

app.use(bodyParser.json({ limit: '40mb' }))
app.use(bodyParser.urlencoded({ limit: '40mb', extended: false }))
app.use(
    cors({
        origin: config.corsOrigin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204
    })
)
console.log(config.corsOrigin)

app.use(blobRoutes)
app.use(authRouter)

app.listen(config.port, () =>
    console.log(`server is running on port: ${config.port}`)
)

export default app
