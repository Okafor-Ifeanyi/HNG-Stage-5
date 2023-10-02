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

  const ffmpeg = require('fluent-ffmpeg');

function mergeVideos(videoPaths, outputFilePath, callback) {
  const command = ffmpeg();

  videoPaths.forEach((videoPath) => {
    command.input(videoPath);
  });

  command.mergeToFile(outputFilePath)
    .on('end', () => {
      console.log('Video merging finished.');
      callback(null, outputFilePath); // Call the callback with success
    })
    .on('error', (err) => {
      console.error('Error merging videos:', err);
      callback(err); // Call the callback with an error
    });

  command.run();
}
  
  
  const outputFilePath = 'path/to/output/merged-video.mp4';
  
  mergeVideos(videoPaths, outputFilePath, (error, mergedFilePath) => {
    if (error) {
      console.error('Video merging failed:', error);
    } else {
      console.log('Merged video saved to:', mergedFilePath);
    }
  });
  
export{ finalizeUpload, getVideoBuffer, mergeVideos }