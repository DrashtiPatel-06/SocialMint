import express from "express"
import cors from "cors"
import {connectDB} from "./db.js"
import userRoutes from "./Routes/userRoutes.js"
import nftRoutes from "./Routes/nftRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/users",userRoutes);
app.use("/nfts",nftRoutes);

const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})