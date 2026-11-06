import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import passport from 'passport';
import '../src/common/config/passport.google.auth.js';
import AuthRouter from './module/auth/auth.routes.js';
import AiRouter from './module/ai/ai.routes.js';

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", 
    credentials: true,             
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v2/chat', AiRouter);
export default app;