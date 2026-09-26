const { GoogleGenAI } = require('@google/genai');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error('Invalid Gemini response');
      }

      return text;

    } catch (error) {
      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      await sleep(3000);
    }
  }
};

module.exports = {
  callGemini,
};