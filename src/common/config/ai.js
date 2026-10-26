
export const apikeyChecker = () => {
  const api_key = process.env.GEMINI_API;
  if (!api_key) {
    console.error("Error: GEMINI_API key is missing in .env file!");
    process.exit(1);
  } else {
    console.log("geminiapi is connected successfully");
  }
};

export const checkGemini = async () => {
  apikeyChecker();
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: api_key });
  console.log("Gemini client is connected");
  return ai;
};
