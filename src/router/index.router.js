import express from 'express'
const router = express.Router()
import { uploader, getAllVideos, getSingleVideo } from '../upload/upload.controller.js';

// Video CRUD Operation
router.post("/upload", uploader);
router.get("/", getAllVideos);
router.get("/:name", getSingleVideo);

export default router