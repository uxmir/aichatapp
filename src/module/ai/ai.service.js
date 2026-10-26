import { checkGemini } from "../../common/config/ai.js";
import ApiError from "../../common/utils/response.error.js";
import aiModel from "./ai.model.js";

const aiResponseCreate = async (text, file, video, image) => {
  const ai = checkGemini();
  const userInput = text || file || video || image;
  if (!userInput) throw ApiError.badRequest("Please ask something");
  try {
    const response = ai.models.generateContentStream({
      model: "gemini-3.8-flash",
      content: userInput,
      config: {
        systemInstruction: "Hi I am Your Good Mern AI CHATBOT",
      },
    });
    for await (const chunk of response) {
     const text= res.write(chunk.text);
     const fileData=res.send(file);
     const aiData= text || fileData
     return aiData
    }
    const savedData = await aiModel.create({
      userInput,
      aiData
    });
    return savedData;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};

 const aiResponseFind=async()=>{
    try {
       const foundData=await aiModel.findOne() ;
       return foundData
    } catch (error) {
       throw ApiError.serverError(`There is something wrong ${error.message}`);  
    }
 }

export{
 aiResponseCreate,
 aiResponseFind
}