const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library

// Set up routes and middleware
// ...

// Create a storage engine for multer that specifies where to save uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create a directory with a unique name for each upload session
    const sessionId = req.params.sessionId; // Retrieve the session ID from the URL
    const uploadDir = path.join(__dirname, 'uploads', sessionId);
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use the original file name as the uploaded file's name
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define the route to handle chunked video uploads
app.post('/upload/:sessionId', upload.single('file'), async (req, res) => {
  const sessionId = req.params.sessionId; // Get the session ID from the URL

  try {
    const chunkData = req.file.buffer;

    // Append the chunk data to the video buffer specific to the session
    const videoBuffer = getVideoBuffer(sessionId); // Retrieve or create the session-specific video buffer
    videoBuffer = Buffer.concat([videoBuffer, chunkData]); // Append the chunk data

    // Respond with success for the chunk upload
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling chunk upload:', error);
    res.status(500).json({ error: 'Error uploading video chunk' });
  }
});

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

// Implement a function to manage session-specific video buffers
const videoBuffers = {};

function getVideoBuffer(sessionId) {
  if (!videoBuffers[sessionId]) {
    videoBuffers[sessionId] = Buffer.alloc(0);
  }
  return videoBuffers[sessionId];
}

// Implement the finalizeUpload function (customize it for your needs)
async function finalizeUpload(sessionId, videoBuffer) {
  // Save the video to a final destination on the server
  const finalVideoPath = path.join(__dirname, 'uploads', sessionId, 'final-video.mp4');
  fs.writeFileSync(finalVideoPath, videoBuffer);

  // Clear the session-specific video buffer
  delete videoBuffers[sessionId];

  return finalVideoPath;
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
