import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import retrievalRoutes from "./routes/retrievalRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use( cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
    })
);

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/retrieval", retrievalRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;