import fs from "fs"
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// Implement a function to manage session-specific video buffers
const videoBuffers = {};

function getVideoBuffer(sessionId) {
  if (!videoBuffers[sessionId]) {
    // Create an in-memory buffer to accumulate video chunks
    videoBuffers[sessionId] = Buffer.alloc(0);
  }
  return videoBuffers[sessionId];
}

// Implement the finalizeUpload function (customize it for your needs)
async function finalizeUpload(sessionId, videoBuffer) {
    // Save the video to a final destination on the server
    const finalVideoPath = path.join('uploads/videos', sessionId, 'final-video.mp4');

    await fs.writeFileSync(finalVideoPath, videoBuffer);
  
    // Clear the session-specific video buffer
    delete videoBuffers[sessionId];
  
    return finalVideoPath;
  }
  
export{ finalizeUpload, getVideoBuffer }