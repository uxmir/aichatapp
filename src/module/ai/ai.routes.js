import express from "express";
const router=express.Router();
import * as AiController from './ai.controller.js'
router.create('/create',AiController.aiResponseCreate)

export default router