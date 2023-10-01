import path from 'path'
import uploadModel from "./upload.model.js";
import { storeImage } from "../config/cloudinary.config.js";
import { finalizeUpload, videoBuffer } from "./upload.util.js";
import {fileURLToPath} from 'url';
import { upload } from '../config/multer.config.js';
import multer from 'multer';



const __filename = fileURLToPath(import.meta.url);

const videoDirectory = path.join(__filename, '../uploads/videos');

const uploader = async(req, res, next) => {
    const Info = req.body;
  console.log(req.file)
  console.log("Hello World: !")

  try {
    if (req.file) {
        // If there is a file in the request, it's a standard upload
        const videoPath = `${req.protocol}://${req.get('host')}/uploads/videos/${req.file.filename}`;
        return res.status(200).json({ success: true, link: videoPath });
    }

      // If there's no file, it's a chunked upload
      // You should handle chunked uploads here, such as assembling the chunks
      // and saving the complete video to a permanent location

      // Check if it's a chunk upload or the finalization request
      if (req.body.finalize) {
          // Handle the request to finalize the upload
          // First, append any remaining chunk data (if needed)
          const chunkData = req.body.chunkData; // Assuming you have a 'chunkData' field in your request
          if (chunkData) {
              fs.appendFile('tempVideo.mp4', chunkData, (err) => {
                  if (err) {
                      console.error('Error appending video chunk:', err);
                      return res.status(500).json({ error: 'Error uploading video chunk' });
                  }

                  // After appending, proceed to finalize by renaming
                  fs.rename('tempVideo.mp4', `uploads/videos/${req.file.filename}`, (err) => {
                      if (err) {
                          console.error('Error finalizing video upload:', err);
                          return res.status(500).json({ error: 'Error finalizing video upload' });
                      } else {
                          const videoPath = `${req.protocol}://${req.get('host')}/uploads/videos/${req.file.filename}`;
                          return res.status(200).json({ success: true, link: videoPath });
                      }
                  });
              });
          }
      }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Success: false, message: error.message }) 
  }
}

const uploadChunk = async (req, res) => {
  try {
    const chunkData = req.file.buffer;

    // Append the chunk data to the video buffer
    videoBuffer = Buffer.concat([videoBuffer, chunkData]);

    // Respond with success for the chunk upload
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling chunk upload:', error);
    res.status(500).json({ error: 'Error uploading video chunk' });
  }
};

// Define the route to finalize the upload
app.post('/finalize-upload/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId; // Get the session ID from the URL

  try {
    const videoBuffer = getVideoBuffer(sessionId); // Retrieve the session-specific video buffer

    // Implement the logic to finalize and save the video based on the session-specific buffer
    const finalVideoPath = await finalizeUpload(sessionId, videoBuffer);

    res.status(200).json({ success: true, link: finalVideoPath });
  } catch (error) {
    console.error('Error finalizing video upload:', error);
    res.status(500).json({ error: 'Error finalizing video upload' });
  }
});


const getSingleVideo = (req, res, next) => {
  const filename = req.params.name;

  const videoPath = path.join(videoDirectory, filename);
  console.log(videoDirectory);
   // Check if the video file exists
   if (fs.existsSync(videoPath)) {
      // Use the 'video/mp4' MIME type for video files (adjust as needed)
      res.setHeader('Content-Type', 'video/mp4');
      
      // Stream the video file to the response
      const videoStream = fs.createReadStream(videoPath);
      videoStream.pipe(res);
  } else {
      // Return a 404 error if the video file does not exist
      res.status(404).send('Video not found');
  }
};

const getAllVideos = (req, res) => {
  try {
    // Read the contents of the video directory
    fs.readdir(videoDirectory, (err, files) => {
        if (err) {
            console.error('Error reading video directory:', err);
            return res.status(500).json({ error: 'An error occurred while fetching videos' });
        }

        // Filter out non-video files (adjust as needed based on file types)
        const videoFiles = files.filter((file) => {
            const fileExtension = path.extname(file).toLowerCase();
            return ['.mp4', '.avi', '.mkv'].includes(fileExtension); // Add more extensions if necessary
        });

        // Construct an array of video URLs
        const videoUrls = videoFiles.map((file) => {
            return `${req.protocol}://${req.get('host')}/uploads/videos/${file}`;
        });

        return res.status(200).json({ success: true, videos: videoUrls });
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ error: 'some error occurred while fetching videos' });
  }
};

export { uploader, uploadChunk, finalizeChunk, getSingleVideo, getAllVideos }