import express from "express";
import { scanUrl } from "../controllers/scanController";

const router = express.Router();

router.post("/url", scanUrl);

export default router;
