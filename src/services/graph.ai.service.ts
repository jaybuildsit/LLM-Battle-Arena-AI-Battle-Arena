// import type { Message } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import {mistralModel,cohereModel} from "./model.service.js"
import {z} from "zod";




const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""),{
        reducer:(current,next)=>{
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""),{
        reducer:(current,next)=>{
            return next
        }
    }),
    judgeRecommendation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score: 0,

    }),
    {
        reducer:(current,next)=>{
            return next
        }
    }
)

});





// type JUDGEMENT = {
//     winner: "solution1" | "solution2";
//     solution_1_score: number;
//     solution_2_score: number;
// }

// type AIBATTLESTATE = {
//     messages: typeof MessagesValue;
//     solution_1: string;
//     solution_2: string;
//     judgement: JUDGEMENT;
// }

// const state: AIBATTLESTATE = {
//     messages: MessagesValue,
//     solution_1: "",
//     solution_2: "",
//     judgement: {
//         winner: "solution1",
//         solution_1_score: 0,
//         solution_2_score: 0,
//     }
// }


const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {


    console.log(state)

    const [mistralResult, cohereResult] =await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])
    return {
        solution_1: mistralResult.text,
        solution_2: cohereResult.text

    }

}

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addEdge(START, "solution")
    .addEdge("solution", END)
    .compile();



    export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(userMessage)
        ]
    })

    console.log(result)

    return result.messages


}

// export default graph


