import crypto from "crypto";
import { generateAnswer } from "../services/chatService.js";
import { createChat,getChatById,addMessage } from "../models/chatModel.js";

export const chat = async (req, res, next) => {
    try {
        const { chatId,documentId,query } = req.body;
        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: "Document ID is required"
            });
        }

        if (!query?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
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
            content: query.trim(),
            createdAt: new Date()
        });

        const result = await generateAnswer(
            query.trim(),
            documentId
        );

        res.setHeader(
            "Content-Type",
            "text/plain; charset=utf-8"
        );

        res.setHeader(
            "Cache-Control",
            "no-cache"
        );

        res.setHeader(
            "Connection",
            "keep-alive"
        );

        if (!result.results.length) {
            const answer = "I could not find relevant information in the uploaded document.";
            await addMessage(activeChatId, {
                role: "assistant",
                content: answer,
                createdAt: new Date()
            });
            res.write(answer);
            res.end();
            return;
        }

        let finalResponse = "";
        for await (const chunk of result.stream) {
            const text = result.getTextContent(chunk.content);
            if (!text) {
                continue;
            }
            finalResponse += text;
            res.write(text);
        }

        await addMessage(activeChatId, {
            role: "assistant",
            content: finalResponse,
            sources: result.results.map(item => ({
                score: item.score,
                metadata: item.metadata
            })),
            createdAt: new Date()
        });
        res.end();
    } catch (error) {
        next(error);
    }
};