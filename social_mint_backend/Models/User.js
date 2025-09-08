import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    walletaddress:{type:String, required:true, unique:true},
    username:{type:String, required:true},
    email:{type:String, required:true},
    bio: String,
    profile_pic: String,
    created_at:{type:Date, default:Date.now}
})  
export default mongoose.model("User",userSchema);