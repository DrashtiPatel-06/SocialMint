import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    nft_id:{type:mongoose.Schema.ObjectId, ref:"NFT",required:true},
    user_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    text:{type:String, required:true},
    created_at:{type:Date, default:Date.now}
})  
export default mongoose.model("Comment",commentSchema);