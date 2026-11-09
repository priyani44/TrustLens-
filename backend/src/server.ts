import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db";
import scanRoutes from "./routes/scanRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TrustLens API is running successfully!",
  });
});

app.use("/api/scan", scanRoutes);

// Connect to Neon and start server
const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("Neon PostgreSQL connected successfully!");

    app.listen(PORT, () => {
      console.log(`TrustLens server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();