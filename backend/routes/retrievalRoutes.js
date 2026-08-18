import express from "express";
import { retrieveRelevantChunks } from "../services/retrievalService.js";

const router = express.Router();
router.post("/search", async (req, res, next) => {
    try {
        const { query } = req.body;
        if (!query?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required"
            });
        }
        const results = await retrieveRelevantChunks(
            query.trim()
        );
        res.status(200).json({
            success: true,
            query,
            results
        });
    } catch (error) {
        next(error);
    }
});

export default router;