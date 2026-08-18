import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { createVectorIndex } from "./services/vectorIndexService.js";

const PORT = process.env.PORT || 5001;
await connectDB();
await createVectorIndex();
app.listen(PORT, () => {
    console.log(`AskAI server running on port ${PORT}`);
});