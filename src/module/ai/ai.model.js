import mongoose from "mongoose";
const aiSchema = new mongoose.Schema({
userInput:{
  type:String,
  required:true
},
aiData:{
  type:String,
  required:true
},
imageUrl:{
  type:String,
  default:""
},
},{timestamps:true});
export default mongoose.model("AI", aiSchema);