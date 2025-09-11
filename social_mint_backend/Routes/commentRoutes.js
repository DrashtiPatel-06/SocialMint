import express from "express"
import Comment from "../Models/Comment.js"

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).json(comment)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        const comment = await Comment.find();
        res.status(201).json(comment)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(400).json({message:"Comment not found!"});
        }
        res.json(comment)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.put("/:id",async(req,res)=>{
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!comment){
            return res.status(400).json({message:"Comment not found!"});
        }
        res.json(comment)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if(!comment){
            return res.status(400).json({message:"Comment not found!"});
        }
         res.json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;