import express from "express";
import passport from "passport";
const router = express.Router();
import * as AuthController  from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("google",{ session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),AuthController.googleAuth)
router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/get-me",authenticate,AuthController.findMe)
export default router;
