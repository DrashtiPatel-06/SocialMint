import mongoose from "mongoose";

const eventAttendanceSchema = new mongoose.Schema({
    event_id:{type:mongoose.Schema.ObjectId, ref:"Event",required:true},
    user_id:{type:mongoose.Schema.ObjectId, ref:"User",required:true},
    scanned_at:{type:Date, default:Date.now}
})  
export default mongoose.model("EventAttendance",eventAttendanceSchema);