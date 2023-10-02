import fs from "fs";
import https from "https";
import { execSync as exec } from "child_process";
import deepgram from "../config/deepgram.js";
import ffmpegStatic from "ffmpeg-static";

function ffmpeg(command) {
  return exec(`${ffmpegStatic} ${command}`);
}

async function transcribe(filePath) {
  ffmpeg(`-i ${filePath} -hide_banner -y -i ${filePath} ${filePath}.wav`);

  const file = {
    buffer: fs.readFileSync(`${filePath}.wav`),
    mimetype: "video/me4",
  };

  const response = await deepgram.transcription.preRecorded(file, {
    punctuation: true,
  });

  return response.results;
}

export { transcribe };