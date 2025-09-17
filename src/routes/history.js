const express = require('express');
const router = express.Router();
const { getTranscripts, deleteTranscript, editTranscript, saveTranscript } = require('../services/supabaseService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const { data, error } = await getTranscripts(user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// route to save transcript
router.post('/', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const { text, title } = req.body;
  const { data, error } = await saveTranscript({ user_id, text, title });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Transcript saved', data });
});

// Additional routes for deleting or updating transcripts can be added here

router.put('/:id', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const transcript_id = req.params.id;
  const { title, text } = req.body;
  const { data, error } = await editTranscript({ user_id, transcript_id, title, text });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Transcript updated', data });
});

// Route to update transcript title and/or text
router.delete('/:id', authMiddleware, async (req, res) => {
  const user_id = req.user.id;
  const transcript_id = req.params.id;
  const { data, error } = await deleteTranscript({ user_id, transcript_id });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Transcript deleted', data });
});


module.exports = router;