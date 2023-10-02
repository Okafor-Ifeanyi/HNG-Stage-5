import express from 'express'
const router = express.Router()
import { uploader, getAllVideos, getSingleVideo, uploadChunk, finalizeChunks, startSession } from '../upload/upload.controller.js';
import { upload } from '../config/multer.config.js';

// Video CRUD Operation
router.post("/upload", upload.single('video') , uploader);
router.get("/", getAllVideos);
router.get("/:name", getSingleVideo);


// Video and Chunk Handling
router.post('/createSession', startSession)
router.post("/upload/:sessionId", upload.single('video'), uploadChunk);
router.post("/finalize-upload/:sessionId", finalizeChunks)

export default router