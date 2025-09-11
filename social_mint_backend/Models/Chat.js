import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    sender_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    receiver_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    message:{type:String, required:true},
    created_at:{type:Date, default:Date.now}
})  
export default mongoose.model("Chat",chatSchema);