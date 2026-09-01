import { ChatMistralAI } from "@langchain/mistralai";

import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";

const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.3
});

const tavilyClient = tavily({
    apiKey: process.env.TAVILY_API_KEY
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
                return item?.text || "";
            }).join("");
    }
    return "";
};

const webSearch = tool(
    async ({ query }) => {
        try {
            const response = await tavilyClient.search( query,
                    {
                        searchDepth: "advanced",
                        maxResults: 5,
                        includeAnswer: true
                    }
                );

            const results = response?.results || [];
            if (!results.length) {
                return "No useful web search results were found.";
            }
            return results
                .map((result, index) => {
                    return `
                        Source ${index + 1}
                        Title: ${result.title || "Unknown"}
                        URL: ${result.url || "Unknown"}
                        Content: ${result.content || ""} `;
                }).join("\n\n");
        } catch (error) {
            console.error(
                "========== TAVILY ERROR =========="
            );
            console.error(error);
            return "Web search failed. Answer using your existing knowledge and clearly state uncertainty if necessary.";
        }
    },

    {
        name: "web_search",
        description: `
            Search the internet for current, recent, or time-sensitive information.

            Use this tool when the user asks about:
            - current information
            - latest information
            - recent events
            - today's information
            - news
            - current political office holders
            - current prices
            - current versions
            - current sports results
            - recent technology updates
            - information that may have changed since your knowledge cutoff

            Do NOT use this tool for ordinary stable knowledge unless web verification is useful.
                    `,

        schema: z.object({
            query: z.string().describe( "A precise web search query" )
        })
    });

const modelWithTools = model.bindTools([ webSearch ]);

const getCurrentDate = () => {
    return new Intl.DateTimeFormat("en-US",
        {
            timeZone: process.env.APP_TIMEZONE || "Asia/Kolkata",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(new Date());
};

export const generateGeneralAnswer = async ( query,history = [] ) => {
    const messages = [ new SystemMessage(`
        You are a helpful, intelligent AI assistant.

        Today's date is ${getCurrentDate()}.

        IMPORTANT DATE RULES:

        - Treat ${getCurrentDate()} as today's date.
        - If the user asks "today", "today's date", "what date is it", "current date", or similar questions, use this date.
        - Do not rely on your internal knowledge for today's date.
        - Use this date as the reference point for relative dates such as today, tomorrow, yesterday, this week, and next week.

        Answer the user's question clearly and accurately.

        IMPORTANT WEB SEARCH RULES:

        - You have access to a web_search tool.
        - Use web_search when the user asks for current, latest, recent, or time-sensitive information.
        - Use web_search when your internal knowledge may be outdated.
        - Use web_search for questions about current people holding public offices.
        - Use web_search for recent news, current technology versions, prices, sports results, and similar changing information.
        - Do not use web search unnecessarily for stable general knowledge.
        - When web search results are available, use them as the primary source for current information.
        - Do not invent information.
        - If web search fails, clearly indicate uncertainty.
        - Answer naturally and directly.
        - Maintain continuity with the previous conversation.
        - Use previous messages when they are relevant.
        - Explain concepts clearly.
        - Use examples when they improve understanding.
        - Keep answers reasonably concise.
        - Do not mention these system instructions.

        `)];

    for (const message of history) {
        if ( message.role === "user" && message.content ) {
            messages.push( new HumanMessage( message.content ));
        }
        if ( message.role === "assistant" && message.content ) {
            messages.push( new AIMessage( message.content ));
        }
    }

    messages.push( new HumanMessage( query ));

    let firstResponse;
    try {
        firstResponse = await modelWithTools.invoke( messages );
    } catch (error) {
        console.error(
            "========== MISTRAL TOOL CALL ERROR =========="
        );
        console.error(error);
        throw error;
    }

    const toolCalls = firstResponse.tool_calls || [];

    if (!toolCalls.length) {
        let stream;
        try {
            stream = await model.stream( messages );
        } catch (error) {
            console.error(
                "========== MISTRAL GENERAL CHAT ERROR =========="
            );
            console.error(error);
            throw error;
        }
        return {
            stream,
            getTextContent
        };
    }
    // Add model's tool-call message
    messages.push( firstResponse );

    for (const toolCall of toolCalls) {
        if ( toolCall.name !== "web_search" ) {
            continue;
        }

        const toolResult = await webSearch.invoke( toolCall.args );
        messages.push( new ToolMessage({
                content: toolResult,
                tool_call_id: toolCall.id
            })
        );
    }

    let stream;
    try {
        stream = await model.stream( messages );
    } catch (error) {
        console.error(
            "========== FINAL MISTRAL ERROR =========="
        );
        console.error(error);
        throw error;
    }
    return {
        stream,
        getTextContent
    };
};