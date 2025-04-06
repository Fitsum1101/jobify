const dotenv = require("dotenv").config();

const { OpenAI } = require("openai");

module.exports = new OpenAI({
  apiKey: dotenv.parsed.OPEN_AI_KEY,
});
