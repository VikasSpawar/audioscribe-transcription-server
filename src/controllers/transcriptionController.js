const fs = require('fs/promises');
const assemblyaiService = require('../services/assemblyaiService');

exports.transcribeAudio = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('No audio file provided.');
    }

    const transcript = await assemblyaiService.transcribeFile(filePath);

    // ✅ Delete the uploaded file after transcription
    try {
      await fs.unlink(filePath);
      console.log("Temporary file deleted:", filePath);
    } catch (cleanupErr) {
      console.warn("Could not delete file:", filePath, cleanupErr.message);
    }

    return transcript;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error; // let router handle the response
  }
};
