// import dotenv from "dotenv";
// dotenv.config();
// export const apikeyChecker = () => {
//   const api_key = process.env.GEMINI_API;
//   if (!api_key) {
//     console.error("Error: GEMINI_API key is missing in .env file!");
//     process.exit(1);
//   } else {
//     console.log("geminiapi is connected successfully");
//     return api_key;
//   }
// };

// export const checkGemini = async () => {
//   apikeyChecker();
//   const { GoogleGenAI } = await import("@google/genai");
//   const ai = new GoogleGenAI({ apiKey: api_key });
//   console.log("Gemini client is connected");
//   return ai;
// };

import dotenv from "dotenv";
dotenv.config();

export const apikeyChecker = () => {
  const api_key = process.env.GEMINI_API;
  if (!api_key) {
    console.error("Error: GEMINI_API key is missing in .env file!");
    process.exit(1);
  } else {
    console.log("geminiapi is connected successfully");
    return api_key; // 🟢 এপিআই কি রিটার্ন করে দিলাম
  }
};

export const checkGemini = async () => {
  // 🟢 apikeyChecker থেকে কি (key) টি রিসিভ করে নিলাম
  const api_key = apikeyChecker(); 
  
  const { GoogleGenAI } = await import("@google/genai");
  
  // 🟢 এখন সঠিক ভেরিয়েবল পাস হলো
  const ai = new GoogleGenAI({ apiKey: api_key }); 
  
  console.log("Gemini client is connected");
  return ai;
};