import express from 'express'
const router = express.Router()
import { uploader, getAllVideos, getSingleVideo } from '../upload/upload.controller.js';
import { upload } from '../config/multer.config.js';

// Video CRUD Operation
router.post("/upload", upload.single('video') , uploader);
router.get("/", getAllVideos);
router.get("/:name", getSingleVideo);

export default router