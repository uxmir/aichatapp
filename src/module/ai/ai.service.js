import { checkOpenAI } from "../../common/config/ai.js";
import ApiError from "../../common/utils/response.error.js";
import aiModel from "./ai.model.js";
import uploadToImagekit from "../../common/utils/upload.imagekit.js";
const aiResponseCreate = async (text, file, sessionId, userId, res) => {
  try {
    const ai = await checkOpenAI();
    if (!text && !file && !userId) throw ApiError.badRequest("Please ask something");

    // setting http
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // for saving image in imagekit
    let imageUrl = "";
    if (file) {
      const responseImage = await uploadToImagekit(file.path, file.filename);
      imageUrl = responseImage.url;
    }

    // sending to ai all chats history (OpenAI Format)
    let messages = [];

    if (sessionId) {
      const existingSession = await aiModel.findById(sessionId);
      if (existingSession && existingSession.chats) {
        existingSession.chats.forEach((chat) => {
          const a = chat.userInput;
          const b = chat.imageUrl;
          const c = chat.aiData;
          if (a || b) {
            let userContent = [];
            if (a) {
              userContent.push({ type: "text", text: a });
            }
            if (b) {
              userContent.push({ type: "image_url", image_url: { url: b } });
            }
            messages.push({ role: "user", content: userContent });
          }
          if (c) {
            messages.push({ role: "assistant", content: c });
          }
        });
      }
    }
    let currentContent = [];
    if (text) {
      currentContent.push({ type: "text", text: text });
    }
    if (imageUrl) {
      currentContent.push({ type: "image_url", image_url: { url: imageUrl } });
    }

    if (currentContent.length > 0) {
      messages.push({ role: "user", content: currentContent });
    } else {
      messages.push({ role: "user", content: "Hello" });
    }

    // OpenAI Stream Request
    const responseStream = await ai.chat.completions.create({
      model: "gpt-6-luna",
      messages: messages,
      stream: true,
    });

    // reply of ai in chunk data
    let aiReply = "";
    for await (const chunk of responseStream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        aiReply += content;
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }

    // saving data in mongodb with session id
    const sessionTitle = text ? text?.substring(0, 10) : "chat History";
    let savedSession;
    if (sessionId) {
      savedSession = await aiModel.findByIdAndUpdate(
        sessionId,
        {
          $push: {
            chats: { userInput: text, aiData: aiReply, imageUrl: imageUrl },
          },
        },
        { returnDocument: "after" },
      );
    } else {
      savedSession = await aiModel.create({
        user: userId,
        newSession: true,
        title: sessionTitle,
        chats: [{ userInput: text, aiData: aiReply, imageUrl: imageUrl }],
      });
    }

    res.write(
      `data: ${JSON.stringify({ done: true, session: savedSession })}\n\n`,
    );
    res.end();
    return savedSession;
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};
//all data fetched in session
const aiResponseFind = async (dataId,userId) => {
  try {
    if (!dataId || !userId) throw ApiError.notFound("datais is not found");
    const foundData = await aiModel.findOne({_id:dataId,user:userId});
    return foundData;
  } catch (error) {
    throw ApiError.serverError(`There is something wrong ${error.message}`);
  }
};
//ai session title find
const aiSessionTitleFind = async (userId) => {
  try {
    const foundTitle = await aiModel
      .find({user:userId})
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
      returnDocument: "after",
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
