import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import chunkText from "../utils/chunkText.js";
import { createEmbeddings } from "./embeddingService.js";
import { saveDocumentChunks } from "./documentService.js";

export const extractPdfText = async (filePath, fileName) => {
    const buffer = await fs.readFile(filePath);
    const parser = new PDFParse({
        data: buffer
    });

    const result = await parser.getText();
    await parser.destroy();
    const chunks = chunkText(result.text);
    const vectors = await createEmbeddings(chunks);
    await saveDocumentChunks({
        fileName,
        chunks,
        vectors
    });
    return {
        text: result.text,
        pages: result.total,
        chunks,
        vectors
    };
};