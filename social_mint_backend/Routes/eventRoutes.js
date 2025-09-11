import express from "express"
import Event from "../Models/Event.js"

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        const event = await Event.find();
        res.status(201).json(event)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(400).json({message:"Event not found!"});
        }
        res.json(event)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.put("/:id",async(req,res)=>{
    try {
        const event = await Event.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!event){
            return res.status(400).json({message:"Event not found!"});
        }
        res.json(event)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if(!event){
            return res.status(400).json({message:"Event not found!"});
        }
         res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;