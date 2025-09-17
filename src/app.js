require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const { startStreaming } = require('./services/assemblyaiStreamingService'); // Adjust the path as needed

const app = express();
expressWs(app); // Enable WebSocket support

app.use(
  cors({
    origin: 'https://audiotex-kappa.vercel.app', // or your frontend URL
    credentials: true,
  })
);

app.use(express.json());

// Use existing REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/upload', uploadRoutes);



// Add WebSocket route for real-time transcription streaming
app.ws('/api/transcription/stream', (clientWs, req) => {
  // Extract userId or any auth info from headers or cookies if necessary
  const userId = req.headers['x-user-id'] || null; // Adapt based on your auth method

  // console.log('Client connected to /api/transcription/stream WebSocket');

  // Start streaming relay with AssemblyAI
  startStreaming(clientWs, userId);

  clientWs.on('close', () => {
    console.log('Client disconnected from transcription stream');
  });

  clientWs.on('error', (err) => {
    console.error('WebSocket error on client connection:', err);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
