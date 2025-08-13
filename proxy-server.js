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

// AI route (Gemini) with context-aware handling
app.post('/ai', async (req, res) => {
  let userPrompt = req.body.prompt;
  const questionType = req.body.questionType || 'general';

  if (!userPrompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Create context-aware prompts based on question type
  let enhancedPrompt = userPrompt;
  
  if (questionType === 'math') {
    enhancedPrompt = `You are a math tutor. Please solve this math problem step by step: "${userPrompt}". 
    Show your work clearly and provide the final answer. Keep it concise but thorough.`;
  } else if (questionType === 'general') {
    enhancedPrompt = `You are a helpful AI assistant. Please answer this question: "${userPrompt}". 
    Provide a clear, informative response.`;
  } else if (questionType === 'mixed') {
    enhancedPrompt = `You are a versatile AI assistant. This question may involve both math and general knowledge: "${userPrompt}". 
    Please provide a comprehensive answer that addresses all aspects.`;
  }

  // Add length constraint to the prompt
  enhancedPrompt += "\nPlease respond in under 50 words.";

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
          contents: [{ parts: [{ text: enhancedPrompt }] }]
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
