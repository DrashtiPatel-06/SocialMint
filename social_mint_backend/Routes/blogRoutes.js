import express from "express"
import blogs from "../Models/Blog.js"

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const blog = new blogs(req.body);
        await blog.save();
        res.status(201).json(blog)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        const blog = await blogs.find();
        res.status(201).json(blog)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const blog = await blogs.findById(req.params.id);
        if(!blog){
            return res.status(400).json({message:"Blog not found!"});
        }
        res.json(blog)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.put("/:id",async(req,res)=>{
    try {
        const blog = await blogs.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!blog){
            return res.status(400).json({message:"Blog not found!"});
        }
        res.json(blog)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const nft = await blogs.findByIdAndDelete(req.params.id);
        if(!nft){
            return res.status(400).json({message:"Blog not found!"});
        }
         res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;