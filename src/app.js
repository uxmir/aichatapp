import express from 'express'
import cookieParser from 'cookie-parser'
// import passport from 'passport'
// import  '../src/common/config/passport.google.auth.js'
const app =express()
app.use(cookieParser())
// app.use(passport.initialize())

export default app