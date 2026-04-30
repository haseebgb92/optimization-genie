import crypto from "node:crypto";

export function hashSecret(secret: string) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export function verifyHmacSignature({
  body,
  signature,
  timestamp,
  secret,
  toleranceSeconds = 300
}: {
  body: string;
  signature: string | null;
  timestamp: string | null;
  secret: string;
  toleranceSeconds?: number;
}) {
  if (!signature || !timestamp) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > toleranceSeconds) return false;
  const base = `${timestamp}.${body}`;
  const digest = crypto.createHmac("sha256", secret).update(base).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}
