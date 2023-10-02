import fs from "fs"
import path from 'path';
import {fileURLToPath} from 'url'
import ffmpeg from "fluent-ffmpeg"
import ffprobeStatic from "ffprobe-static";

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
const targetDirectory = path.dirname(__filename);
const UploadDirectory = path.dirname(targetDirectory);
const srcUploadDirectory = path.dirname(UploadDirectory);

// Implement the finalizeUpload function (customize it for your needs)
async function finalizeUpload(sessionId, videoBuffer) {
    // Save the video to a final destination on the server
    const finalVideoPath = path.join(srcUploadDirectory, 'uploads/videos', sessionId, 'final-video.mp4');

    await fs.writeFileSync(finalVideoPath, videoBuffer);
  
    // Clear the session-specific video buffer
    delete videoBuffers[sessionId];
  
    return finalVideoPath;
  }
// console.log(__filename)
ffmpeg.setFfprobePath(ffprobeStatic);

function mergeVideos(videoPaths, outputFilePath, callback) {
  const command = ffmpeg();
  videoPaths.forEach((videoPath) => {
    command.input(videoPath);
  });
  console.log('outputFilePath 1:', outputFilePath);
  command.mergeToFile('uploads/videos/651aaaf2b42870794d8dcec7/merged-video.mp4').on('end', () => {
    console.log('outputFilePath 2:', outputFilePath);
      console.log('Video merging finished.');
      callback(null, outputFilePath); // Call the callback with success
    })
    .on('error', (err) => {
      console.error('Error merging videos:', err);
      callback(err); // Call the callback with an error
    });

  command.run();
}
  
export{ finalizeUpload, getVideoBuffer, mergeVideos }