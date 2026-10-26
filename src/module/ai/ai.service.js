import { checkGemini } from "../../common/config/ai.js";
import ApiError from "../../common/utils/response.error.js";
import aiModel from "./ai.model.js";
import uploadToImagekit from "../../common/utils/upload.imagekit.js";
const aiResponseCreate = async (text, file) => {
  try {
    const ai = await checkGemini();
    if (!text && !file) throw ApiError.badRequest("Please ask something");
    //for saving image in imagekit
    let imageUrl = "";
    if (file) {
      const responseImage = await uploadToImagekit(file.path, file.filename);
      imageUrl = responseImage.url;
    }
    //for streaming content from ai
    const response = ai.models.generateContentStream({
      model: "gemini-3.8-flash",
      contents:[{role:"user",parts:{text:text}}],
      config: {
        systemInstruction: "Hi I am Your Good Mern AI CHATBOT",
      },
    });
    //reply of ai in chunk data
    let aiReply=""
    for await (const chunk of response) {
     if(chunk.text){
      aiReply += chunk.text
     }
    }
    //saving data in mongodb
    const savedData = await aiModel.create({
    userInput:text,
    aiData:aiReply,
    imageUrl:imageUrl
    });
    return savedData;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};

const aiResponseFind = async () => {
  try {
    const foundData = await aiModel.find();
    return foundData;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};

const aiResponseDelete = async (responseId) => {
  try {
    if(!responseId) throw ApiError.notFound("chatid is not found")
    const deleteData = await aiModel.findByIdAndDelete(responseId);
    return deleteData;
  } catch (error) {}
};
export { aiResponseCreate, aiResponseFind, aiResponseDelete };
