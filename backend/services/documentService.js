import { ObjectId } from "mongodb";
import { collection, database } from "../config/vectorStore.js";

const documentsCollection = database.collection("documents");

export const createDocument = async (data) => {
    const document = {
        ...data,
        createdAt: new Date(),
    };
    const result = await documentsCollection.insertOne(document);
    return {
        _id: result.insertedId,
        ...document,
    };
};

export const getAllDocuments = async () => {
    return documentsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

};

export const getDocumentById = async (documentId) => {
    return documentsCollection.findOne({
        documentId,
    });
};

export const saveDocumentChunks = async ({ documentId, fileName, chunks, vectors }) => {
    if (!chunks.length) {
        return {
            documentId,
            insertedCount: 0,
        };
    }
    const documents = chunks.map(
        (chunk, index) => ({
            text: chunk,
            embedding: vectors[index],
            metadata: {
                documentId,
                fileName,
                chunkIndex: index,
            },
            createdAt: new Date(),
        })
    );

    const result = await collection.insertMany(documents);

    return {
        documentId,
        insertedCount:
            result.insertedCount,
    };
};

export const generateDocumentId = () => {
    return new ObjectId().toString();
};