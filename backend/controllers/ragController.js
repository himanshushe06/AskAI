import crypto from "crypto";

import { askQuestion } from "../services/ragService.js";
import { createChat,getChatById,addMessage } from "../models/chatModel.js";

export const askQuestionController = async (req, res, next) => {
    try {
        const { question, documentId, chatId } = req.body;

        if (!question?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }
        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: "documentId is required"
            });
        }

        let currentChat = null;
        if (chatId) {
            currentChat = await getChatById(chatId);
        }

        const activeChatId = currentChat?.chatId || crypto.randomUUID();
        if (!currentChat) {
            await createChat({
                chatId: activeChatId,
                documentId
            });
        }

        await addMessage(activeChatId, {
            role: "user",
            content: question.trim(),
            createdAt: new Date()
        });

        const result = await askQuestion({
            question: question.trim(),
            documentId
        });


        if (!result?.stream) {
            const answer = "I could not find relevant information in the uploaded document.";
            await addMessage(activeChatId, {
                role: "assistant",
                content: answer,
                sources: [],
                createdAt: new Date()
            });

            return res.status(200).json({
                success: true,
                chatId: activeChatId,
                answer,
                sources: []
            });
        }

        let answer = "";
        for await (const chunk of result.stream) {
            const text = result.getTextContent(chunk.content);
            if (!text) { continue }
            answer += text;
        }

        await addMessage(activeChatId, {
            role: "assistant",
            content: answer,
            sources: result.results.map(item => ({
                score: item.score,
                metadata: item.metadata
            })),
            createdAt: new Date()
        });

        return res.status(200).json({
            success: true,
            chatId: activeChatId,
            answer,
            sources: result.results.map(item => ({
                score: item.score,
                metadata: item.metadata
            }))
        });
    } catch (error) {
        console.error(
            "RAG Controller Error:",
            error
        );
        next(error);
    }
};