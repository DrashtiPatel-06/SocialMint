import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    title:{type:String, required:true},
    content:{type:String, required:true},
    metadata_uri: {type:String, required:true},
    txid: {type:String, required:true},
    created_at:{type:Date, default:Date.now}
})  
export default mongoose.model("Blog",blogSchema);