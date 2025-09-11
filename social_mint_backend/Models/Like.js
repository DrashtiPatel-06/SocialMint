import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    nft_id:{type:mongoose.Schema.ObjectId, ref:"NFT",required:true},
    user_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    created_at:{type:Date, default:Date.now}
})  
export default mongoose.model("Like",likeSchema);