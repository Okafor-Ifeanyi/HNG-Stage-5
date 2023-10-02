import path from 'path'
import uploadModel from "./upload.model.js";
import { storeImage } from "../config/cloudinary.config.js";
import { finalizeUpload, getVideoBuffer, mergeVideos } from "./upload.util.js";
import {fileURLToPath} from 'url';
import { transcribe } from './upload.helper.js';
import fs from 'fs'


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

const startSession = async (req, res) => {
  try{
    const session = await uploadModel.create({})

    // Respond with success to use _id as sessionId
    res.status(200).json({ 
      success: true, 
      message: "Video Session Started", 
      sessionId: session._id
    });
  } catch(error) {
    console.error('Error handling chunk upload:', error.message);
    res.status(500).json({ error: error.message });
  }
}

// Define the route to handle chunked video uploads
const uploadChunk = async (req, res) => {
  const sessionId = req.params.sessionId; // Get the session ID from the URL

  try {
    // // if (!(chunkData instanceof Buffer)){
    // //   chunkData = fs.readFileSync(req.file.path);
    // // }
    // const chunkData = req.file.buffer;
    // console.log(req.file)
    // console.log(req.file.buffer)   
    const filePath = req.file.path;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
      } else {
        // 'data' now contains the buffer with the file's content
        // You can process or manipulate the buffer here
        console.log("File read successfully")
        // Append the chunk data to the video buffer specific to the session
        let videoBuffer = getVideoBuffer(sessionId); // Retrieve or create the session-specific video buffer

        videoBuffer = Buffer.concat([videoBuffer, data]); // Append the chunk data
      }
    });

    const session = await uploadModel.findByIdAndUpdate(sessionId, { 
      $push: { chunk_path: filePath } }, { new: true })

    // Respond with success for the chunk upload
    return res.status(200).json({ 
      success: true,
      message: "Video Saved Successfully",
      sessionData: session
    });

  } catch (error) {
    console.error('Error handling chunk upload:', error);
    res.status(500).json({ error: error.message });
  }
};

// Define the route to finalize the upload
const finalizeChunks = async (req, res) => {
  const sessionId = req.params.sessionId; // Get the session ID from the URL
  try {
    let videoBuffer = getVideoBuffer(sessionId); // Retrieve the session-specific video buffer

    // Implement the logic to finalize and save the video based on the session-specific buffer
    const finalVideoPath = await finalizeUpload(sessionId, videoBuffer);

    // get session id object from the db
    const sessionData = await uploadModel.findOne({_id: sessionId})
    
    // creating output path
    const outputPath = `uploads/videos/${sessionId}/merged-video.mp4`

    mergeVideos(sessionData.chunk_path, outputPath, (error, mergedFilePath) => {
      if (error) {
        console.error('Video merging failed:', error);
      } else {
        console.log('Merged video saved to:', mergedFilePath);
      }
      return mergedFilePath
    });

    // const trans = await transcribe(finalVideoPath);

    // update the session here
    const session = await uploadModel.findByIdAndUpdate(sessionId, {
       transcription: trans }, { new: true })

    res.status(200).json({ 
      success: true, 
      link: finalVideoPath,
      mergedVideo: outputPath,
      sessionData: session
    });
  } catch (error) {
    console.error('Error finalizing video upload:', error);
    res.status(500).json({ error: 'Error finalizing video upload' });
  }
};


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

export { uploader, uploadChunk, finalizeChunks, getSingleVideo, getAllVideos, startSession }