import express from 'express'
const router = express.Router()
import { uploader, getAllVideos, getSingleVideo, uploadChunk, finalizeChunks, startSession } from '../upload/upload.controller.js';
import { upload } from '../config/multer.config.js';

// Video CRUD Operation
router.post("/upload", upload.single('video') , uploader);
router.get("/", getAllVideos);
router.get("/:name", getSingleVideo);

router.post('/test_upload/:sessionId', upload.single('file'), (req, res) => {
    // At this point, req.file.buffer contains the binary data of the uploaded file
    const bufferData = req.file.buffer;
    
    // You can now process or save bufferData as needed
    // For example, you can write it to a file on the server
    console.log(bufferData)
    // Respond with success
    res.status(200).json({ success: true });
  });

// Video and Chunk Handling
router.post('/createSession', startSession)
router.post("/upload/:sessionId", upload.single('video'), uploadChunk);
router.post("/finalize-upload/:sessionId", finalizeChunks)

export default router