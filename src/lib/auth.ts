import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sitndip_admin";
export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sitndip2026";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "sitndip-admin-ok";

export function isValidLogin(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASSWORD;
}

export async function isAdmin() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
}

export function adminToken() {
  return ADMIN_TOKEN;
}
