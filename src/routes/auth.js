const express = require('express');
const router = express.Router();
const { signup, login } = require('../services/supabaseService');

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await signup({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await login({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;