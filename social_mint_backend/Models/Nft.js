import mongoose from "mongoose";

const nftSchema = new mongoose.Schema({
    user_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    metadata_uri:{type:String, required:true},
    title:{type:String, required:true},
    description: {type:String},
    media_url: {type:String, required:true},
    txid: {type:String, required:true},
    created_at:{type:Date, default:Date.now}
})  
export default mongoose.model("nft",nftSchema);