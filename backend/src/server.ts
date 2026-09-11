import express,{Request,Response} from "express";

const app = express();

const PORT = 3000;

app.get('/health',(req:Request,res:Response)=>{
    res.json({status:"Server is Running"});
});

app.get('/ping',(req:Request,res:Response)=>{
    res.json({message:"ok"});
});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});