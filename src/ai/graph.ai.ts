// import type { Message } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, type GraphNode, StateGraph, START, END } from "@langchain/langgraph";
// import type { GraphNode } from "@langchain/langgraph";
import { mistralModel, cohereModel, geminiModel } from "./model.ai.js"
import { createAgent, providerStrategy } from 'langchain';
import { z } from "zod";




const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    judgeRecommendation: new ReducedValue(z.object().default({
        solution_1_score: 0,
        solution_2_score: 0,

    }),
        {
            reducer: (current, next) => {
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

    const [mistralResult, cohereResult] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])
    return {
        solution_1: mistralResult.text,
        solution_2: cohereResult.text

    }

}

const judgeNode: GraphNode<typeof State> = async (state: typeof State) => {

    console.log("Invoking Judge ", state)

    const { solution_1, solution_2 } = state;

    const judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
        }))
    })

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(
                `You are a judge for an AI battle.

You will be given two solutions to the same problem.

Score each solution from 0 to 10.

Solution 1:
${solution_1}

Solution 2:
${solution_2}`
            )
        ]
    });

    console.log("JUDGE RESPONSE:", judgeResponse);
    console.log("STRUCTURED RESPONSE:", judgeResponse.structuredResponse);

    return {
        judgeRecommendation: judgeResponse.structuredResponse
    };

}

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
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


