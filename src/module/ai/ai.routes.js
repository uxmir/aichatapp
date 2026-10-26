import express from "express";
const router=express.Router();
import * as AiController from './ai.controller.js'
router.create('/create',AiController.aiResponseCreate)
router.get('/get',AiController.aiResponseFind)
router.delete('/delete/:id',AiController.aiResponseDelete)
export default router