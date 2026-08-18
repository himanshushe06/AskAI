import { vectorStore } from "../config/vectorStore.js";

export const retrieveRelevantChunks = async ( query,documentId ) => {
    const limit = Number( process.env.RETRIEVAL_LIMIT || 4);
    const results = await vectorStore.similaritySearchWithScore(
        query,
        limit,
        {
            preFilter: { documentId }
        }
    );

    return results.map(([document, score]) => ({
        text: document.pageContent || "",
        score,
        metadata: document.metadata || {}
    }));
};