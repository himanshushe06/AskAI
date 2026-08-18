import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME || "documind"
    });

    console.log("MongoDB Atlas connected");
    };

export default connectDB;