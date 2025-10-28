const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Environment variable GOOGLE_CREDENTIALS must be set
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// Function to upload file to Google Drive
const uploadToGoogleDrive = async (filePath, fileName) => {
  const fileMetadata = { name: fileName, parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] }; // Use specific folder ID
  const media = { mimeType: "application/pdf", body: fs.createReadStream(filePath) };
  
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });
  
  // Make the file publicly accessible
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: { role: "reader", type: "anyone" },
  });
  
  // Return the direct download URL
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