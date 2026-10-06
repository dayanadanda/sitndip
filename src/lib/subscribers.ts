import crypto from "crypto";
import { getSubscribers, saveSubscribers, type StoredSubscriber } from "./db";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function findSubscriber(email: string): StoredSubscriber | undefined {
  const value = normalizeEmail(email);
  return getSubscribers().find((item) => item.email === value);
}

export function addSubscriber(email: string, name = ""): { subscriber?: StoredSubscriber; already?: boolean; error?: string } {
  const value = normalizeEmail(email);
  if (!isValidEmail(value)) return { error: "Please enter a valid email." };
  const existing = findSubscriber(value);
  if (existing) return { already: true, subscriber: existing };
  const subscriber: StoredSubscriber = {
    id: `sub${Date.now().toString(36)}${crypto.randomBytes(2).toString("hex")}`,
    email: value,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  const list = getSubscribers();
  list.push(subscriber);
  saveSubscribers(list);
  return { subscriber };
}

export function removeSubscriber(email: string) {
  const value = normalizeEmail(email);
  const list = getSubscribers();
  const next = list.filter((item) => item.email !== value);
  saveSubscribers(next);
  return next.length < list.length;
}
