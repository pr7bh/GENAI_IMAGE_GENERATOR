import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { OpenAI } from "openai";

dotenv.config();

// Check if the environment variable is set correctly
if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set in the environment.");
  process.exit(1);
}

// Setup OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Controller to generate image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    // Generate image
    const response = await openai.images.create({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    // Access the generated image data
    const generatedImage = response.data[0].b64_json;

    return res.status(200).json({ photo: generatedImage });
  } catch (error) {
    next(
      createError(
        error.status || 500,
        error.response?.data?.error?.message || error.message
      )
    );
  }
};
