import express from "express";
const router=express.Router();
import * as AiController from './ai.controller.js'
router.post('/create',AiController.aiResponseCreate)
router.get('/get',AiController.aiResponseFind)
router.delete('/delete/:id',AiController.aiResponseDelete)
router.put('/update/:id',AiController.aiResponseSessionTitleUpdate)
export default router