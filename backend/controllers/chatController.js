import crypto from "crypto";
import { createChat,getChatById,getAllChats,addMessage,deleteChat } from "../models/chatModel.js";
import { generateGeneralAnswer } from "../services/chatService.js";

export const getAllChatsController = async (req, res, next) => {
    try {
        const chats = await getAllChats();
        return res.status(200).json({
            success: true,
            chats
        });
    } catch (error) {
        next(error);
    }
};

// single chat
export const getChatController = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required"
            });
        }
        const chat = await getChatById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }
        return res.status(200).json({
            success: true,
            chat
        });
    } catch (error) {
        next(error);
    }
};

//general chat message
export const sendChatController = async (req, res, next) => {
    try {
        const { chatId, message } = req.body;
        if (!message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        let currentChat = null;
        if (chatId) {
            currentChat = await getChatById(chatId);
        }

        const activeChatId = currentChat?.chatId || crypto.randomUUID();
        if (!currentChat) {
            currentChat = await createChat({
                chatId: activeChatId,
                type: "general",
                title: message.trim().slice(0, 50)
            });
        }

        const history = currentChat?.messages || [];
        await addMessage( activeChatId,
            {
                role: "user",
                content: message.trim(),
                createdAt: new Date()
            }
        );
        const result = await generateGeneralAnswer( message.trim(), history);
        res.setHeader( "Content-Type", "text/plain; charset=utf-8" );
        res.setHeader( "Cache-Control", "no-cache" );
        res.setHeader( "Connection", "keep-alive" );
        // VERY IMPORTANT
        res.setHeader( "X-Chat-Id",activeChatId );
        let finalResponse = "";

        

        for await ( const chunk of result.stream ) {
            const text = result.getTextContent( chunk.content );
            if (!text) {
                continue;
            }
            finalResponse += text;
            res.write(text);
        }

        await addMessage(
            activeChatId,
            {
                role: "assistant",
                content: finalResponse,
                createdAt: new Date()
            }
        );
        res.end();
    } catch (error) {
        next(error);
    }
};

export const deleteChatController = async ( req,res,next ) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required"
            });
        }
        const result = await deleteChat(chatId);
        if ( result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
                chatId
            });
        }

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
            chatId
        });


    } catch (error) {
        next(error);
    }
};