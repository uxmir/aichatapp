import express from 'express'
import cookieParser from 'cookie-parser'
// import passport from 'passport'
// import  '../src/common/config/passport.google.auth.js'
const app =express()
app.use(cookieParser())
// app.use(passport.initialize())
import AiRouter from './module/ai/ai.routes.js'
//airesponse create
app.use('/api/v2/ai',AiRouter)
export default app