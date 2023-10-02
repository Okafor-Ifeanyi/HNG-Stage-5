import express from 'express'
const router = express.Router()
import { upload } from '../config/multer.config.js';
import {    getAllVideos, 
            streamSingleVideo, 
            uploadChunk, 
            finalizeChunks, 
            startSession,
            getSingleSession    } from '../upload/upload.controller.js';

            
// Video and Chunk Handling
router.post('/createSession', startSession)
router.post("/upload/:sessionId", upload.single('video'), uploadChunk);
router.post("/finalize-upload/:sessionId", finalizeChunks)
            
// Video CRUD Operation
router.get("/", getAllVideos);
router.get("/stream/:sessionId", streamSingleVideo);
router.get("/:sessionId", getSingleSession);
            
export default router