import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use("/auth", authRoutes);

export default app;
