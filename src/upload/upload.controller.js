import uploadModel from "./upload.model.js";
import { finalizeUpload, getVideoBuffer, mergeVideos } from "./upload.util.js";
import fs from 'fs'

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
    console.log(sessionData)

    // creating output path
    const outputPath = `uploads/videos/${sessionId}/merged-video.mp4`

    // Issue of ffmpeg ssociated with block 135 - 144 below

    // mergeVideos(sessionData.chunk_path, outputPath, (error, mergedFilePath) => {
    //   if (error) {
    //     console.error('Video merging failed:', error);
    //   } else {
    //     console.log('Merged video saved to:', mergedFilePath);
    //   }
    //   return mergedFilePath
    // });

    // This link should transcribe the final video
    // const trans = await transcribe(finalVideoPath);

    // update the session here with the transcribed data
    const session = await uploadModel.findByIdAndUpdate(sessionId, {
       video_url: finalVideoPath }, { new: true })

    res.status(200).json({ 
      success: true, 
      link: finalVideoPath,
      // mergedVideo: outputPath,
      sessionData: session
    });
  } catch (error) {
    console.error('Error finalizing video upload:', error);
    res.status(500).json({ error: 'Error finalizing video upload' });
  }
};


const streamSingleVideo = async (req, res, next) => {
  const sessionId = req.params.sessionId;

  try {
    const sessionData = await uploadModel.findOne({_id : sessionId })

    if (!sessionData){
      return res.status(401).json({success: false, message: "User not found"})
    }
    
    if (fs.existsSync(sessionData.video_url)) {
        // Use the 'video/mp4' MIME type for video files (adjust as needed)
        res.setHeader('Content-Type', 'video/mp4');
        
        // Stream the video file to the response
        const videoStream = fs.createReadStream(videoPath);
        videoStream.pipe(res);
    } else {
        // Return a 404 error if the video file does not exist
        res.status(404).send('Video not found');
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getSingleSession = async (req, res) => {
  const sessionId = req.params.sessionId
  try {
    const sessionData = await uploadModel.findOne({_id: sessionId})

    return res.status(200).json({
      success: true,
      message: "Session Retrieved Successfully",
      data: sessionData
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

const getAllVideos = async (req, res) => {
  try {
    const sessionData = await uploadModel.find()

    return res.status(200).json({
      success: true,
      message: "All Session's Retrieved Successfully",
      data: sessionData
    })

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export { uploadChunk, finalizeChunks, getSingleSession, streamSingleVideo, getAllVideos, startSession }