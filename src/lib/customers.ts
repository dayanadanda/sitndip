import crypto from "crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";
import type { Customer } from "./types";

export const SESSION_COOKIE = "sitndip_session";
const SESSION_DAYS = 30;

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
};

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function checkPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function toCustomer(row: UserRow): Customer {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone };
}

export function registerCustomer(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): { customer?: Customer; error?: string } {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (!name) return { error: "Please enter your name." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Please enter a valid email." };
  if (input.password.length < 6) return { error: "Password must be at least 6 characters." };

  const db = getDb();
  if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) {
    return { error: "An account with this email already exists. Please log in." };
  }

  const id = `u${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`;
  db.prepare(
    "INSERT INTO users (id, name, email, phone, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(id, name, email, input.phone.trim(), hashPassword(input.password), new Date().toISOString());

  return { customer: { id, name, email, phone: input.phone.trim() } };
}

export function verifyCustomer(email: string, password: string): Customer | null {
  const row = getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.trim().toLowerCase()) as UserRow | undefined;
  if (!row || !checkPassword(password, row.password_hash)) return null;
  return toCustomer(row);
}

export function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(
    token,
    userId,
    expiresAt,
  );
  return { token, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export function deleteSession(token: string) {
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export async function getSessionCustomer(): Promise<Customer | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = getDb()
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, Date.now()) as UserRow | undefined;

  return row ? toCustomer(row) : null;
}
