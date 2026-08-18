import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractPdfText = async (filePath) => {
    const buffer = await fs.readFile(filePath);
    const parser = new PDFParse({
        data: buffer
    });
    const result = await parser.getText();
    await parser.destroy();
    return {
        text: result.text,
        pages: result.total
    };
};