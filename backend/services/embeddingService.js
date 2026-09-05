import { MistralAIEmbeddings } from "@langchain/mistralai";

let embeddings;

const getEmbeddings = () => {
    if (!embeddings) {
        embeddings = new MistralAIEmbeddings({
            model: process.env.MISTRAL_EMBEDDING_MODEL || "mistral-embed"
        });
    }
    return embeddings;
};
export const createEmbeddings = async (texts) => {
    if (!texts.length) {
        return [];
    }
    return getEmbeddings().embedDocuments(texts);
};