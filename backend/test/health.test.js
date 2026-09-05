import express from "express";
import request from "supertest";
import healthRoutes from "../routes/healthRoutes.js";

const app = express();

app.use("/api/health", healthRoutes);

describe("Health Check", () => {
    test("should return 200 OK", async () => {
        const res = await request(app).get("/api/health");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty(
            "message",
            "AskAI backend is running"
        );
    });
});