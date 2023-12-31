import mongoose from "mongoose";
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    video_url: {
      type: String,
    },
    description: {
      type: String
    },
    chunk_path: {
      type: Array
    },
    transcription: {
      type: String
   }
  },
    { timestamps: {
      createdAt: true,
      updatedAt: false
    }}
  );
  
  const uploadModel = mongoose.model("Upload", uploadSchema);
  
export default uploadModel