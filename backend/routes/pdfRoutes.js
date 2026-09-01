import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import { uploadPdf, getDocuments } from "../controllers/pdfController.js";
const router = express.Router();

router.get( "/", getDocuments );

router.post( "/upload", upload.single("pdf"),uploadPdf);
export default router;