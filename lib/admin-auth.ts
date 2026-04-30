import crypto from "node:crypto";
import { getPool } from "@/lib/postgres";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function verifyAdminCredentials(emailRaw: string, passwordRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  const password = passwordRaw.trim();
  const pool = getPool();

  if (!pool) {
    // Fallback for environments without DATABASE_URL.
    return email === "haseeb.dlp@gmail.com" && password === "F@@kpasword4289";
  }

  const hash = sha256(password);
  const result = await pool.query(
    "select id from users where lower(email)=lower($1) and role='admin' and password_hash=$2 limit 1",
    [email, hash]
  );
  return result.rowCount > 0;
}
