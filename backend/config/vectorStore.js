import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MistralAIEmbeddings } from "@langchain/mistralai";

const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db(process.env.DB_NAME || "documind");
const collection = database.collection(
    process.env.MONGODB_VECTOR_COLLECTION || "document_chunks"
);
const embeddings = new MistralAIEmbeddings({
    model: process.env.MISTRAL_EMBEDDING_MODEL || "mistral-embed",
    apiKey: process.env.MISTRAL_API_KEY
});
const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: process.env.MONGODB_VECTOR_INDEX || "vector_index",
    textKey: "text",
    embeddingKey: "embedding"
});

export { client, collection, vectorStore };