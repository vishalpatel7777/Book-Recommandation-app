const multer = require("multer");
const os = require("os");
const { UPLOAD_DIR } = require("../config/paths");
const { MAX_PDF_SIZE_MB } = require("../config/constants");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname.replace(/ /g, "_")}`;
    cb(null, filename);
  },
});

const uploadPdf = multer({
  storage,
  limits: { fileSize: MAX_PDF_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
}).single("pdf");

module.exports = { uploadPdf };