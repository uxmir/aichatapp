import * as aiService from "./ai.service.js";
import ApiResponse from "../../common/utils/response.success.js";
const aiResponseCreate = async (req, res) => {
  const { text } = req.body;
  const file = req.file;
  const result = await aiService.aiResponseCreate(text, file);
  ApiResponse.created(res, "data created successfully", result);
};

const aiResponseFind = async (req, res) => {
  const fetchedData = await aiService.aiResponseFind();
  ApiResponse.ok(res, "data fetched successfully", fetchedData);
};
const aiResponseDelete = async (req, res) => {
  const deletedData = await aiService.aiResponseDelete(req.params.id);
  ApiResponse.ok(res, "data is deleted", deletedData);
};
export { aiResponseCreate, aiResponseFind, aiResponseDelete };
