import express from "express";
import { retrieveRelevantChunks } from "../services/retrievalService.js";

const router = express.Router();
router.post("/search", async (req, res, next) => {
    try {
        const { query, documentId } = req.body;
        if (!query?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }
        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: "Document ID is required"
            });
        }
        const results = await retrieveRelevantChunks(
            query.trim(),
            documentId
        );
        res.status(200).json({
            success: true,
            query,
            documentId,
            results
        });
    } catch (error) {
        next(error);
    }
});
export default router;