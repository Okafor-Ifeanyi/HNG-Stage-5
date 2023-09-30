import fs from "fs"
import { Readable } from "stream";

// Create an in-memory buffer to accumulate video chunks
let videoBuffer = Buffer.alloc(0);

// Define a function to process and finalize the upload
const finalizeUpload = () => {
  if (videoBuffer.length === 0) {
    return Promise.resolve(); // No chunks to finalize
  }

  return new Promise((resolve, reject) => {
    // Create a readable stream from the video buffer
    const videoStream = new Readable();
    videoStream.push(videoBuffer);
    videoStream.push(null);

    // Specify the destination path for the final video
    const finalVideoPath = `uploads/videos/${Date.now()}_video.mp4`;

    // Create a writable stream to save the video to the final path
    const writableStream = fs.createWriteStream(finalVideoPath);

    // Pipe the video stream to the writable stream
    videoStream.pipe(writableStream);

    writableStream.on('finish', () => {
      resolve(finalVideoPath);
    });

    writableStream.on('error', (err) => {
      reject(err);
    });
  });
};

export{ finalizeUpload, videoBuffer }