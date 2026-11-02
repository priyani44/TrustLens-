import { Request, Response } from "express";

export const scanUrl = (req: Request, res: Response) => {
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

const hasIPAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(parsedUrl.hostname);
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

return res.status(200).json({
  success: true,
  scannedUrl: parsedUrl.href,
  riskScore,
  riskLevel,
  reasons:
    reasons.length > 0
      ? reasons
      : ["No obvious suspicious patterns were detected."],
  disclaimer:
    "This is a basic heuristic check, not a guarantee that the website is safe.",
});

} catch (error) {
return res.status(500).json({
success: false,
message: "Something went wrong while scanning the URL.",
});
}
};
