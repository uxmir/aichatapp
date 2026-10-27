import express from "express";
const router = express.Router();
import * as AiController from "./ai.controller.js";
router.post("/create", AiController.aiResponseCreate);
router.get("/get/title", AiController.aiSessionTitleFind);
router.get("/get/:id", AiController.aiResponseFind);
router.delete("/delete/:id", AiController.aiResponseDelete);
router.put("/update/:id", AiController.aiResponseSessionTitleUpdate);
export default router;
