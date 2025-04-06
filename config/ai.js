const dotenv = require("dotenv").config();
const { OpenAI } = require("openai");

module.exports = new OpenAI({
  apiKey: `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`,
});
