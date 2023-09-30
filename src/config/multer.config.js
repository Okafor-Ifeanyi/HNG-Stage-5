import express from 'express';
import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos/'); // Save uploaded files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Use a unique file name
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export { upload };
