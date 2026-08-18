import { MistralAIEmbeddings } from "@langchain/mistralai";

const embeddings = new MistralAIEmbeddings({
    model: process.env.MISTRAL_EMBEDDING_MODEL || "mistral-embed"
});

export const createEmbeddings = async (texts) => {
    if (!texts.length) {
        return [];
    }
    return embeddings.embedDocuments(texts);
};