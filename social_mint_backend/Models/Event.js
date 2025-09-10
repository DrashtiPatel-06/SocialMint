import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    title:{type:String, required:true},
    description:{type:String, required:true},
    date_time: {type:String, required:true},
    nft_id:{type:mongoose.Schema.ObjectId, ref:"NFT",required:true},
    qr_code_url: {type:String, required:true},
    created_at:{type:Date, default:Date.now}
})  
export default mongoose.model("Event",eventSchema);