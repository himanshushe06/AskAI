import fs from "fs/promises";
import { extractPdfText } from "../services/pdfService.js";

export const uploadPdf = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required"
            });
        }

        const pdfData = await extractPdfText(req.file.path);

        await fs.unlink(req.file.path);

        res.status(200).json({
        success: true,
        file: {
            name: req.file.originalname,
            size: req.file.size,
            pages: pdfData.pages,
            textLength: pdfData.text.length,
            preview: pdfData.text.slice(0, 500)
        }
        });
    } catch (error) {
        if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
        }

        next(error);
    }
};