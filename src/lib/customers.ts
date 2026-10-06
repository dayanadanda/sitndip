import crypto from "crypto";
import { cookies } from "next/headers";
import { getResets, getSessions, getUsers, saveResets, saveSessions, saveUsers, type StoredUser } from "./db";
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
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    buildingNumber: row.buildingNumber ?? "",
  };
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
  if (!input.phone.trim()) return { error: "Please enter your phone number." };

  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { error: "An account with this email already exists. Please log in." };
  }

  const customer: StoredUser = {
    id: `u${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`,
    name,
    email,
    phone: input.phone.trim(),
    address: "",
    city: "",
    buildingNumber: "",
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

export function updateCustomerProfile(
  userId: string,
  input: {
    name: string;
    phone: string;
    address: string;
    city: string;
    buildingNumber: string;
  },
): { customer?: Customer; error?: string } {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const address = input.address.trim();
  const city = input.city.trim();
  const buildingNumber = input.buildingNumber.trim();
  if (!name) return { error: "Please enter your name." };
  if (!phone) return { error: "Please enter your phone number." };
  if (!address) return { error: "Please enter your address." };
  if (!buildingNumber) return { error: "Please enter your building or house number." };
  if (!city) return { error: "Please enter your city." };

  const users = getUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index < 0) return { error: "Account not found." };

  users[index] = {
    ...users[index],
    name,
    phone,
    address,
    city,
    buildingNumber,
  };
  saveUsers(users);
  return { customer: toCustomer(users[index]) };
}

export function requestPasswordReset(email: string) {
  const user = getUsers().find((row) => row.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return {};
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resets = getResets().filter((item) => item.expiresAt > Date.now() && item.userId !== user.id);
  resets.push({ tokenHash, userId: user.id, expiresAt: Date.now() + 60 * 60 * 1000 });
  saveResets(resets);
  return { token, email: user.email };
}

export function resetCustomerPassword(token: string, password: string): { ok?: boolean; error?: string } {
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resets = getResets();
  const reset = resets.find((item) => item.tokenHash === tokenHash && item.expiresAt > Date.now());
  if (!reset) return { error: "This reset link is invalid or has expired." };
  const users = getUsers();
  const index = users.findIndex((user) => user.id === reset.userId);
  if (index < 0) return { error: "Account not found." };
  users[index] = { ...users[index], passwordHash: hashPassword(password) };
  saveUsers(users);
  saveResets(resets.filter((item) => item.tokenHash !== tokenHash));
  return { ok: true };
}
