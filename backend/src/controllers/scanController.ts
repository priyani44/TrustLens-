import { Request, Response } from "express";
import { pool } from "../db";

export const scanUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL.",
      });
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format.",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Only HTTP and HTTPS URLs are allowed.",
      });
    }

    const suspiciousPatterns = [
      "login-verify",
      "account-suspended",
      "free-gift",
      "claim-prize",
      "verify-account",
      "password-reset",
    ];

    const matchedPatterns = suspiciousPatterns.filter((pattern) =>
      parsedUrl.href.toLowerCase().includes(pattern)
    );

    const hasIPAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(
      parsedUrl.hostname
    );

    const usesHttp = parsedUrl.protocol === "http:";
    const hasUnusualLength = parsedUrl.href.length > 100;

    let riskScore = 0;
    const reasons: string[] = [];

    if (usesHttp) {
      riskScore += 25;
      reasons.push("Website does not use HTTPS encryption.");
    }

    if (hasIPAddress) {
      riskScore += 25;
      reasons.push("URL uses an IP address instead of a domain name.");
    }

    if (hasUnusualLength) {
      riskScore += 15;
      reasons.push("URL has an unusually long structure.");
    }

    if (matchedPatterns.length > 0) {
      riskScore += 30;
      reasons.push("URL contains suspicious keywords.");
    }

    riskScore = Math.min(riskScore, 100);

    const riskLevel =
      riskScore >= 60
        ? "Dangerous"
        : riskScore >= 30
        ? "Suspicious"
        : "Safe";

    const finalReasons =
      reasons.length > 0
        ? reasons
        : ["No obvious suspicious patterns were detected."];

    // Save scan result in Neon PostgreSQL
    const result = await pool.query(
      `INSERT INTO scans (url, risk_score, risk_level, reasons)
       VALUES ($1, $2, $3, $4)
       RETURNING id, scanned_at`,
      [parsedUrl.href, riskScore, riskLevel, finalReasons]
    );

    return res.status(200).json({
      success: true,
      scannedUrl: parsedUrl.href,
      riskScore,
      riskLevel,
      reasons: finalReasons,
      scanId: result.rows[0].id,
      scannedAt: result.rows[0].scanned_at,
      disclaimer:
        "This is a basic heuristic check, not a guarantee that the website is safe.",
    });

  } catch (error) {
    console.error("URL scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while scanning the URL.",
    }

  );
  
  }
  
};
export const getScanHistory = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM scans ORDER BY scanned_at DESC`
    );

    return res.status(200).json({
      success: true,
      totalScans: result.rows.length,
      scans: result.rows,
    });
  } catch (error) {
    console.error("Fetch scan history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch scan history.",
    });
  }
};
// GET MESSAGE SCAN HISTORY

export const getMessageScanHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM message_scans ORDER BY scanned_at DESC`
    );

    return res.status(200).json({
      success: true,
      totalScans: result.rows.length,
      scans: result.rows,
    });

  } catch (error) {
    console.error("Fetch message scan history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch message scan history.",
    });
  }
};

export const scanEmail = async (req: Request, res: Response) => {
  try {
    const { senderEmail, subject, emailBody } = req.body;

    if (
      !subject?.trim() ||
      !emailBody?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide the email subject and content.",
      });
    }

    let riskScore = 0;
    const reasons: string[] = [];

    const emailText = `${senderEmail || ""} ${subject} ${emailBody}`.toLowerCase();

    const suspiciousPhrases = [
      "account suspended",
      "account blocked",
      "verify your account",
      "click here immediately",
      "claim your prize",
      "you have won",
      "urgent action required",
      "update your kyc",
      "send your otp",
      "share your password",
      "bank details",
      "confirm your identity",
      "payment failed",
      "limited time offer",
      "claim your refund",
      "lottery winner",
      "pay processing fee",
    ];

    const matchedPhrases = suspiciousPhrases.filter((phrase) =>
      emailText.includes(phrase)
    );

    if (matchedPhrases.length > 0) {
      riskScore += Math.min(matchedPhrases.length * 15, 45);
      reasons.push("Email contains suspicious words or phrases.");
    }

    if (/https?:\/\/|www\./i.test(emailBody)) {
      riskScore += 15;
      reasons.push("Email contains a link. Verify it before opening.");
    }

    if (/\b(otp|password|pin|cvv)\b/i.test(emailBody)) {
      riskScore += 20;
      reasons.push("Email may be requesting sensitive information.");
    }

    if (/\b(urgent|immediately|hurry|act now|expires today)\b/i.test(emailText)) {
      riskScore += 10;
      reasons.push("Email uses urgent or pressure-based language.");
    }

    if (senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      riskScore += 15;
      reasons.push("Sender email address appears invalid.");
    }

    riskScore = Math.min(riskScore, 100);

    let riskLevel = "Safe";

    if (riskScore >= 60) {
      riskLevel = "Dangerous";
    } else if (riskScore >= 25) {
      riskLevel = "Suspicious";
    }

    const result = await pool.query(
      `INSERT INTO email_scans
       (sender_email, subject, email_body, risk_score, risk_level, reasons)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        senderEmail || null,
        subject,
        emailBody,
        riskScore,
        riskLevel,
        reasons,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Email analysis completed.",
      scan: result.rows[0],
      riskScore,
      riskLevel,
      reasons,
      disclaimer:
        "This is a basic rule-based analysis and cannot guarantee whether an email is safe or fraudulent.",
    });
  } catch (error) {
    console.error("Email scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze email.",
    });
  }
};

export const getEmailScanHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM email_scans ORDER BY scanned_at DESC`
    );

    return res.status(200).json({
      success: true,
      totalScans: result.rows.length,
      scans: result.rows,
    });

  } catch (error) {
    console.error("Fetch email scan history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch email scan history.",
    });
  }
};

export const deleteScan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM scans WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Scan record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scan deleted successfully.",
    });
  } catch (error) {
    console.error("Delete scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete scan.",
    });
  }
};
export const scanMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid message.",
      });
    }

    const text = message.toLowerCase();

    const suspiciousPatterns = [
      "account suspended",
      "account blocked",
      "verify your account",
      "click this link",
      "claim your prize",
      "you have won",
      "limited time offer",
      "urgent action required",
      "send otp",
      "share your otp",
      "send your password",
      "bank details",
      "update your kyc",
      "claim your refund",
      "lottery winner",
      "pay processing fee",
    ];

    const matchedPatterns = suspiciousPatterns.filter((pattern) =>
      text.includes(pattern)
    );

    let riskScore = 0;
    const reasons: string[] = [];

    if (matchedPatterns.length > 0) {
      riskScore += Math.min(matchedPatterns.length * 20, 60);
      reasons.push("Message contains suspicious words or phrases.");
    }

    if (/https?:\/\//i.test(message)) {
      riskScore += 15;
      reasons.push("Message contains a clickable web link.");
    }

    if (/\b\d{4,6}\b/.test(message) && /otp|verification code/i.test(message)) {
      riskScore += 25;
      reasons.push("Message requests or mentions a verification code.");
    }

    if (/urgent|immediately|act now|within \d+ hours/i.test(message)) {
      riskScore += 15;
      reasons.push("Message uses urgency or pressure tactics.");
    }

    riskScore = Math.min(riskScore, 100);

    const riskLevel =
      riskScore >= 60
        ? "Dangerous"
        : riskScore >= 30
        ? "Suspicious"
        : "Safe";

    const finalReasons =
      reasons.length > 0
        ? reasons
        : ["No obvious suspicious patterns were detected."];

    const result = await pool.query(
      `INSERT INTO message_scans (message, risk_score, risk_level, reasons)
       VALUES ($1, $2, $3, $4)
       RETURNING id, scanned_at`,
      [message, riskScore, riskLevel, finalReasons]
    );

    return res.status(200).json({
      success: true,
      scannedMessage: message,
      riskScore,
      riskLevel,
      reasons: finalReasons,
      scanId: result.rows[0].id,
      scannedAt: result.rows[0].scanned_at,
      disclaimer:
        "This is a basic rule-based check, not a guarantee that a message is safe or fraudulent.",
    });
  } catch (error) {
    console.error("Message scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while scanning the message.",
    });
  }
};