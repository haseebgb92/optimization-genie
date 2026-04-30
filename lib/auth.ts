import crypto from "node:crypto";

const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "change-me-immediately";
}

export function createAdminSession(email: string) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${email}.${exp}`;
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSession(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length < 3) return false;
  const [email, expRaw, sig] = parts;
  const exp = Number(expRaw);
  if (!email || !Number.isFinite(exp) || Date.now() / 1000 > exp) return false;
  const payload = `${email}.${expRaw}`;
  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  if (expected.length !== sig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
