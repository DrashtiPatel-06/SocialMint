import express from "express"
import nfts from "../Models/Nft.js"

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const nft = new nfts(req.body);
        await nft.save();
        res.status(201).json(nft)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/",async(req,res)=>{
    try {
        const nft = await nfts.find();
        res.status(201).json(nft)
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

router.get("/:id",async(req,res)=>{
    try {
        const nft = await nfts.findById(req.params.id);
        if(!nft){
            return res.status(400).json({message:"NFT not found!"});
        }
        res.json(nft)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.put("/:id",async(req,res)=>{
    try {
        const nft = await nfts.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!nft){
            return res.status(400).json({message:"NFT not found!"});
        }
        res.json(nft)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

router.delete("/:id",async(req,res)=>{
    try {
        const nft = await nfts.findByIdAndDelete(req.params.id);
        if(!nft){
            return res.status(400).json({message:"NFT not found!"});
        }
         res.json({ message: "NFT deleted" });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
export default router;