import express from "express";
import { scanUrl, getScanHistory,getMessageScanHistory,  scanMessage, scanEmail,
deleteScan,
getEmailScanHistory} from "../controllers/scanController";

const router = express.Router();

// URL scanning
router.post("/url", scanUrl);

// Fetch scan history
router.get("/history", getScanHistory);

router.get("/message-history", getMessageScanHistory);
router.get("/email-history", getEmailScanHistory);
// Delete a specific scan
router.delete("/:id", deleteScan);

router.post("/email", scanEmail);

router.post("/message", scanMessage);

export default router;