import { database } from "../config/vectorStore.js";

const documents = database.collection("documents");
export const createDocument = async (data) => {
    const document = {
        ...data,
        createdAt: new Date()
    };
    const result = await documents.insertOne(document);
    return {
        _id: result.insertedId,
        ...document
    };
};
export const getDocumentById = async (documentId) => {
    return documents.findOne({
        documentId
    });
};