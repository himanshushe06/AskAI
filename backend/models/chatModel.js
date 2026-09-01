import { database } from "../config/vectorStore.js";

const chats = database.collection("chats");

export const createChat = async (data) => {
    const chat = {
        ...data,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };
    const result = await chats.insertOne(chat);
    return {
        _id: result.insertedId,
        ...chat
    };
};

export const getChatById = async (chatId) => {
    return chats.findOne({
        chatId
    });
};

export const getAllChats = async () => {
    return chats
        .find({ type: "general" })
        .sort({ updatedAt: -1 })
        .toArray();
};

export const addMessage = async (chatId, message) => {
    await chats.updateOne(
        { chatId },
        {
            $push: {
                messages: message
            },
            $set: {
                updatedAt: new Date()
            }
        }
    );
    return getChatById(chatId);
};

export const deleteChat = async (chatId) => {
    const result = await chats.deleteOne({
        chatId
    });
    return result;
};