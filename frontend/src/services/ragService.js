import api from "./api";

export const askQuestion = async ({ question,documentId,chatId = null }) => {
    const response = await api.post("/rag/ask", {
        question,
        documentId,
        chatId
    });

    return response.data;
};