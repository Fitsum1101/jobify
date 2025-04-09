const { GoogleGenAI } = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

module.exports = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
