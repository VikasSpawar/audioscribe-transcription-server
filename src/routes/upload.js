const express = require('express');
const router = express.Router();
const multer = require('../middleware/multerConfig');
const authMiddleware = require('../middleware/authMiddleware');
const { saveTranscript } = require('../services/supabaseService');
const { transcribeAudio } = require('../controllers/transcriptionController');

router.post('/', authMiddleware, multer.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    // const user_id = req.user.id;
    const audioPath = req.file.path;

    // console.log("User ID:", user_id);
    // console.log("Audio Path:", audioPath);

    const transcript = await transcribeAudio(audioPath);



    res.json({ transcript });
  } catch (err) {
    console.error("Route error:", err);
    res.status(500).json({ error: "Transcription failed" });
  }
});

module.exports = router;
