import * as aiService from "./ai.service.js";
import ApiResponse from "../../common/utils/response.success.js";
const aiResponseCreate = async (req, res) => {
  const {userInput,aiData}=await aiService.aiResponse(req.body,req.file)
  ApiResponse.created(res, "data created successfully", userInput,aiData);
};
export { aiResponseCreate };
