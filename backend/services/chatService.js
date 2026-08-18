import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage,SystemMessage } from "@langchain/core/messages";
import { retrieveRelevantChunks } from "./retrievalService.js";

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.2
});

const getTextContent = (content) => {
    if (typeof content === "string") {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .map(item => {
                if (typeof item === "string") {
                    return item;
                }
                return item.text || "";
            })
            .join("");
    }
    return "";
};

export const generateAnswer = async ( query,documentId ) => {
    const results = await retrieveRelevantChunks( query,documentId );

    if (!results.length) {
        return {
            results,
            stream: null,
            getTextContent
        };
    }

    const context = results
        .map((item, index) => {
            return `Context ${index + 1}:\n${item.text}`;
        })
        .join("\n\n");

    const messages = [
        new SystemMessage(`
            You are a helpful AI assistant that answers questions using the provided document context.

            Rules:
            - Answer using only the provided document context.
            - Do not invent information.
            - If the answer cannot be found in the document, say that the information is not available in the uploaded document.
            - Give clear and concise answers.
            - Do not mention context numbers in the final answer.
        `),
        new HumanMessage(`
            Document context:${context}
            User question:${query}
        `)
    ];
    const stream = await model.stream(messages);
    return {
        results,
        stream,
        getTextContent
    };
};