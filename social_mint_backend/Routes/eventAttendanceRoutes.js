import express from "express"
import EventAttendance from "../Models/EventAttendance.js"

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const eventAttendance = new EventAttendance(req.body);
        await eventAttendance.save();
        res.status(201).json(eventAttendance)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        const eventAttendance = await EventAttendance.find();
        res.status(201).json(eventAttendance)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const eventAttendance = await EventAttendance.findById(req.params.id);
        if(!eventAttendance){
            return res.status(400).json({message:"EventAttendance not found!"});
        }
        res.json(eventAttendance)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.put("/:id",async(req,res)=>{
    try {
        const eventAttendance = await EventAttendance.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!eventAttendance){
            return res.status(400).json({message:"EventAttendance not found!"});
        }
        res.json(eventAttendance)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const eventAttendance = await EventAttendance.findByIdAndDelete(req.params.id);
        if(!eventAttendance){
            return res.status(400).json({message:"EventAttendance not found!"});
        }
         res.json({ message: "EventAttendance deleted" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;