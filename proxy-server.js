const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const API_KEY = process.env.API_KEY;
const LIVE_API_URL = 'https://laughing-train-kihf.onrender.com';

// CORS config
const allowedOrigin = 'http://127.0.0.1:5500';
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Proxy math route
app.get('/math', async (req, res) => {
  try {
    const response = await fetch(`${LIVE_API_URL}/api/math`, {
      headers: { 'x-api-key': API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from live API' });
  }
});

// AI route (Gemini) with word limit
app.post('/ai', async (req, res) => {
  let userPrompt = req.body.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Add length constraint to the prompt
  userPrompt += "\nPlease respond in under 30 words.";

  try {
    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }]
        })
      }
    );

    const data = await geminiRes.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch from Gemini API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
