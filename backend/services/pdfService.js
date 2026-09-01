import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

import chunkText from "../utils/chunkText.js";
import { createEmbeddings } from "./embeddingService.js";

import { createDocument,saveDocumentChunks,generateDocumentId } from "./documentService.js";
export const extractPdfText = async (filePath, fileName) => {
    const buffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const chunks = chunkText(result.text);
    const vectors = await createEmbeddings(chunks);

    const documentId = generateDocumentId();
    await createDocument({
        documentId,
        fileName,
        pages: result.total,
        textLength: result.text.length,
        chunkCount: chunks.length,
        embeddingDimension: vectors[0]?.length || 0,
    });
    await saveDocumentChunks({ documentId,fileName,chunks,vectors});
    return {
        text: result.text,
        pages: result.total,
        chunks,
        vectors,
        documentId,
    };
};