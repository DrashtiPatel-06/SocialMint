import express from "express"
import Like from "../Models/Like.js"

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const like = new Like(req.body);
        await like.save();
        res.status(201).json(like)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        const like = await Like.find();
        res.status(201).json(like)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const like = await Like.findById(req.params.id);
        if(!like){
            return res.status(400).json({message:"Like not found!"});
        }
        res.json(like)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.put("/:id",async(req,res)=>{
    try {
        const like = await Like.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!like){
            return res.status(400).json({message:"Like not found!"});
        }
        res.json(like)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const like = await Like.findByIdAndDelete(req.params.id);
        if(!like){
            return res.status(400).json({message:"Like not found!"});
        }
         res.json({ message: "Like deleted" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;