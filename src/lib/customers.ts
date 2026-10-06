import crypto from "crypto";
import { cookies } from "next/headers";
import { getSessions, getUsers, saveSessions, saveUsers, type StoredUser } from "./db";
import type { Customer } from "./types";

export const SESSION_COOKIE = "sitndip_session";
const SESSION_DAYS = 30;

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

function toCustomer(row: StoredUser): Customer {
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

  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { error: "An account with this email already exists. Please log in." };
  }

  const customer: StoredUser = {
    id: `u${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`,
    name,
    email,
    phone: input.phone.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  users.push(customer);
  saveUsers(users);
  return { customer: toCustomer(customer) };
}

export function verifyCustomer(email: string, password: string): Customer | null {
  const row = getUsers().find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
  if (!row || !checkPassword(password, row.passwordHash)) return null;
  return toCustomer(row);
}

export function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const sessions = getSessions().filter((session) => session.expiresAt > Date.now());
  sessions.push({ token, userId, expiresAt });
  saveSessions(sessions);
  return { token, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export function deleteSession(token: string) {
  saveSessions(getSessions().filter((session) => session.token !== token));
}

export async function getSessionCustomer(): Promise<Customer | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = getSessions().find((item) => item.token === token && item.expiresAt > Date.now());
  if (!session) return null;
  const user = getUsers().find((item) => item.id === session.userId);
  return user ? toCustomer(user) : null;
}
