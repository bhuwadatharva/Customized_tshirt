import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

// Initialize OpenAI instance correctly
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure API Key is set
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    res.status(200).json({ photo: response.data[0].url });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

export default router;
