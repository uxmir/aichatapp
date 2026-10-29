import { configureStore } from "@reduxjs/toolkit";
import chatReducer from '../store/chatSlice'
export const store=configureStore({
 reducer:{
  chat:chatReducer  
 }   
})
export type RootState=ReturnType<typeof store.getState>
export type appDispatch=typeof store.dispatch