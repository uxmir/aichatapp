import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors";
// import passport from 'passport'
// import  '../src/common/config/passport.google.auth.js'
const app =express()
app.use(cookieParser())
// app.use(passport.initialize())
import AiRouter from './module/ai/ai.routes.js'
//cors middleware
app.use(
  cors({
    origin: "http://localhost:3000", 
    // credentials: true,              
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json())
//airesponse create
app.use('/api/v2/chat',AiRouter)
export default app