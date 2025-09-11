import express from "express"
import Chat from "../Models/Chat.js"

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const chat = new Chat(req.body);
        await chat.save();
        res.status(201).json(chat)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        const chat = await Chat.find();
        res.status(201).json(chat)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const chat = await Chat.findById(req.params.id);
        if(!chat){
            return res.status(400).json({message:"Chat not found!"});
        }
        res.json(chat)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.put("/:id",async(req,res)=>{
    try {
        const chat = await Chat.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!chat){
            return res.status(400).json({message:"Chat not found!"});
        }
        res.json(chat)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if(!chat){
            return res.status(400).json({message:"Chat not found!"});
        }
         res.json({ message: "Chat deleted" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;