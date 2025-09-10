import express from "express"
import cors from "cors"
import {connectDB} from "./db.js"
import userRoutes from "./Routes/userRoutes.js"
import nftRoutes from "./Routes/nftRoutes.js"
import blogRoutes from "./Routes/blogRoutes.js"
import eventRoutes from "./Routes/eventRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/users",userRoutes);
app.use("/nfts",nftRoutes);
app.use("/blogs",blogRoutes);
app.use("/events",eventRoutes);

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})