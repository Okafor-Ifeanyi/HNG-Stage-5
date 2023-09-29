import express from 'express'
import cors from "cors"
import morgan from "morgan"
import formData from 'express-form-data'
import { errorHandler } from '../middlewares/error.middleware'

export function createServer() {
    const app = express()

    app.use(morgan('dev'))

    // Setup Cross-Origin Resource Sharing 
    // to enable passing requests through the frontend
    app.use(cors({
        origin: '*', // Replace * with the client's domain if necessary
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        credentials: true
      }));

    // Form type
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(formData.parse())

    // Route link
    app.use('/api', router)

    // Error Handler
    app.use(errorHandler)

    return app
}