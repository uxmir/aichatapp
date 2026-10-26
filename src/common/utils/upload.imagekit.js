import imageKit from "../config/imagekit.js";
import ApiError from "./response.error.js";
import fs from "fs";

const uploadToImagekit = async (filePath, fileName) => {
  try {
    const fileData = fs.readFileSync(filePath);
    const response = await imageKit.upload({
      file: fileData,
      fileName: fileName,
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return response;
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw ApiError.badRequest(`ImageKit error is :${error?.message}`);
  }
};

export default uploadToImagekit