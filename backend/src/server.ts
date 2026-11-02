 import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import scanRoutes from "./routes/scanRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
origin: "http://localhost:5173",
}));
app.use(express.json());

app.get("/", (req, res) => {
res.json({
message: "TrustLens API is running successfully!",
});
});

app.use("/api/scan", scanRoutes);

app.listen(PORT, () => {
 console.log(`TrustLens server running on http://localhost:${PORT}`);
});