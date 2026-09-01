import express from "express"
import graph from "./ai/graph.ai.js"
import { success } from "zod";
import cors from "cors"


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}))
app.use(express.json())


app.get("/api", async (req, res) => {
    const result = await graph("Whats the best Ai model for text generation?")
    res.json(result)
    
})


app.post("/invoke", async (req, res) => {
    const { problem } = req.body
    const result = await graph(problem)


    res.status(200).json({
        message:"Success",
        success: true,
        data: result
    })

})
// app.post("/use-graph",async (req,res)=>{

// })

export default app
