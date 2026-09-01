const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Environment variable GOOGLE_CREDENTIALS must be set
let drive = null;
try {
  const creds = process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : null;
  if (creds) {
    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    drive = google.drive({ version: "v3", auth });
  }
} catch (e) {
  console.warn("[s3Helper] GOOGLE_CREDENTIALS parse failed — Drive uploads will fallback to local:", e.message);
}

// Function to upload file to Google Drive — falls back to local URL if Drive not configured
const uploadToGoogleDrive = async (filePath, fileName) => {
  if (!drive) {
    // Fallback: return local static path (uploads are served from /uploads)
    return `/uploads/${fileName}`;
  }
  const fileMetadata = { name: fileName, parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] };
  const media = { mimeType: "application/pdf", body: fs.createReadStream(filePath) };
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: { role: "reader", type: "anyone" },
  });
  return `https://drive.google.com/uc?export=download&id=${response.data.id}`;
};

// Utility to clean up local temporary files
const cleanupLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Cleanup: Deleted temporary file at ${filePath}`);
  }
};

module.exports = {
  uploadToGoogleDrive,
  cleanupLocalFile,
};