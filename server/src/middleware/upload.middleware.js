const multer = require("multer");
const os = require("os");
const path = require("path");

// Use the OS temporary directory for Multer storage
const uploadDir = os.tmpdir(); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Setting upload destination:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname.replace(/ /g, '_')}`; // Replace spaces
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

// 60 MB limit for PDF files
const uploadPdf = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
}).single("pdf");

module.exports = { uploadPdf };