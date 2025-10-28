const app = require("./src/app.cjs");
require("dotenv").config(); // Ensure dotenv is loaded first
const { connectToDb } = require("./conn/index");

const port = process.env.PORT || 1000; // Use a dedicated port variable

// Start the server only after connecting to the database
async function startServer() {
  try {
    await connectToDb(); // Connect to MongoDB
    
    app.listen(port, () => {
      console.log(`🚀 Server started at http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("Fatal Error starting server:", error.message);
    process.exit(1);
  }
}

startServer();