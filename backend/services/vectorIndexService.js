import { collection } from "../config/vectorStore.js";

export const createVectorIndex = async () => {
    const indexName = process.env.MONGODB_VECTOR_INDEX || "vector_index";
    await collection.createIndex({
        _id: 1
    });

    const indexes = await collection
        .listSearchIndexes()
        .toArray();

    const existingIndex = indexes.find( index => index.name === indexName );

    if (existingIndex) {
        console.log("MongoDB vector index already exists");
        return;
    }

    await collection.createSearchIndex({
        name: indexName,
        type: "vectorSearch",
        definition: {
            fields: [
                {
                    type: "vector",
                    path: "embedding",
                    numDimensions: 1024,
                    similarity: "cosine"
                }
            ]
        }
    });

    console.log("MongoDB vector index created");
};