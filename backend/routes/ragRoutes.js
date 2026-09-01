import express from "express";
import { askQuestionController } from "../controllers/ragController.js";

const router = express.Router();

router.post("/ask", askQuestionController);

export default router;