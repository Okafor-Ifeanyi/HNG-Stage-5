import express from 'express'
import cors from "cors"
import morgan from "morgan"
import router from "../router/index.router.js"
import { errorHandler } from '../middlewares/error.middleware.js'

export function createServer() {
    const app = express()

    app.use(morgan('dev'))

    // Setup Cross-Origin Resource Sharing 
    // to enable passing requests through the frontend
    app.use(cors({
        origin: '*', // Replace * with the client's domain if necessary
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        credentials: true
    }));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    
    // Route link
    app.use('/api', router)

    // Form type
    app.use(express.json())
    
    // Serve uploaded video files
    app.use('/uploads/videos', express.static('uploads/videos'));
    
    // Error Handler
    app.use(errorHandler)
    
    return app
}