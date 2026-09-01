import fs from "fs/promises";
import { extractPdfText } from "../services/pdfService.js";
import { getAllDocuments } from "../services/documentService.js";

export const uploadPdf = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required",
            });
        }

        const pdfData = await extractPdfText(
                req.file.path,
                req.file.originalname
            );
        await fs.unlink(
            req.file.path
        );

        return res.status(200).json({
            success: true,
            documentId: pdfData.documentId,
            file: {
                name: req.file.originalname,
                size: req.file.size,
                pages: pdfData.pages,
                textLength: pdfData.text.length,
                chunkCount: pdfData.chunks.length,
                embeddingDimension: pdfData.vectors[0]?.length || 0,
            },
        });
    } catch (error) {
        if (req.file?.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        next(error);
    }
};

//get all Document
export const getDocuments = async ( req, res, next ) => {
    try {
        const documents = await getAllDocuments();
        return res.status(200).json({
            success: true,
            documents,
        });
    } catch (error) {
        next(error);
    }
};