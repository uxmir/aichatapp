import { checkGemini } from "../../common/config/ai.js";
import ApiError from "../../common/utils/response.error.js";
import aiModel from "./ai.model.js";
import uploadToImagekit from "../../common/utils/upload.imagekit.js";
const aiResponseCreate = async (text, file, sessionId) => {
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
      contents: [{ role: "user", parts: { text: text } }],
      config: {
        systemInstruction: "Hi I am Your Good Mern AI CHATBOT",
      },
    });
    //reply of ai in chunk data
    let aiReply = "";
    for await (const chunk of response) {
      if (chunk.text) {
        aiReply += chunk.text;
      }
    }
    //saving data in mongodb with session id
    const sessionTitle = text ? text?.substring(0, 10) : "chat History";
    if (sessionId) {
      const updatedSession = await aiModel.findByIdAndUpdate(
        sessionId,
        {
          $push: {
            chats: { userInput: text, aiData: aiReply, imageUrl: imageUrl },
          },
        },
        { new: true },
      );
      if (updatedSession) return updatedSession;
    } else {
      const newSession = await aiModel.create({
        newSession: true,
        title: sessionTitle,
        chats: [{ userInput: text, aiData: aiReply, imageUrl: imageUrl }],
      });
      return newSession;
    }
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};
//all data fetched in session
const aiResponseFind = async (dataId) => {
  try {
    if (!dataId) throw ApiError.notFound("datais is not found");
    const foundData = await aiModel.findById(dataId);
    return foundData;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};
//ai session title find
const aiSessionTitleFind = async () => {
  try {
    const foundTitle = await aiModel
      .find()
      .select("title")
      .sort({ createdAt: -1 });
    return foundTitle;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};
//ai sessiontitle update
const aiResponseSessionTitleUpdate = async (dataId, data) => {
  try {
    const updateTitle = await aiModel.findByIdAndUpdate(dataId, data, {
      new: true,
      runValidators: true,
    });
    return updateTitle;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};
//ai session delete
const aiResponseSessionDelete = async (responseId) => {
  try {
    if (!responseId) throw ApiError.notFound("chatid is not found");
    const deleteData = await aiModel.findByIdAndDelete(responseId);
    return deleteData;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};
export {
  aiResponseCreate,
  aiResponseFind,
  aiResponseSessionDelete,
  aiResponseSessionTitleUpdate,
  aiSessionTitleFind,
};
