import express from "express"
import graph from "./ai/graph.ai.js"

const app = express()


app.get("/api", async (req, res) => {
    const result = await graph("Whats the best Ai model for text generation?")
    res.json(result)
    
})

// app.post("/use-graph",async (req,res)=>{

// })

export default app
