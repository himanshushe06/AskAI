import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadPdf } from "../controllers/pdfController.js";

const router = express.Router();

router.post("/upload", upload.single("pdf"), uploadPdf);

export default router;