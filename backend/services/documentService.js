import { collection } from "../config/vectorStore.js";

export const saveDocumentChunks = async ({ fileName,chunks,vectors }) => {
    if (!chunks.length) {
        return [];
    }

    const documents = chunks.map((chunk, index) => ({
        text: chunk,
        embedding: vectors[index],
        metadata: {
            fileName,
            chunkIndex: index
        },
        createdAt: new Date()
    }));
    const result = await collection.insertMany(documents);
    return result.insertedIds;
};