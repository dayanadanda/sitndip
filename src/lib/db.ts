import fs from "fs";
import path from "path";
import type { Category, Message, Order, Product, Slide } from "./types";
import { seedCategories, seedProducts, seedSlides } from "./seed";

const dataDir = path.join(process.cwd(), "data");

function ensureDataDir() {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) {
    writeJson(file, fallback);
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  ensureDataDir();
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
}

export function getProducts(): Product[] {
  const products = readJson<Product[]>("products.json", seedProducts);
  return products.length ? products : seedProducts;
}

export function saveProducts(products: Product[]) {
  writeJson("products.json", products);
}

export function getCategories(): Category[] {
  const categories = readJson<Category[]>("categories.json", seedCategories);
  return categories.length ? categories : seedCategories;
}

export function saveCategories(categories: Category[]) {
  writeJson("categories.json", categories);
}

export function getSlides(): Slide[] {
  const slides = readJson<Slide[]>("slides.json", seedSlides);
  return slides.length ? slides : seedSlides;
}

export function saveSlides(slides: Slide[]) {
  writeJson("slides.json", slides);
}

export function getMessages(): Message[] {
  return readJson<Message[]>("messages.json", []);
}

export function saveMessages(messages: Message[]) {
  writeJson("messages.json", messages);
}

export function getOrders(): Order[] {
  return readJson<Order[]>("orders.json", []);
}

export function saveOrders(orders: Order[]) {
  writeJson("orders.json", orders);
}

export function addOrder(order: Order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function getOrdersForUser(userId: string): Order[] {
  return getOrders().filter((order) => order.userId === userId);
}

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
};

export type StoredSession = {
  token: string;
  userId: string;
  expiresAt: number;
};

export function getUsers(): StoredUser[] {
  return readJson<StoredUser[]>("users.json", []);
}

export function saveUsers(users: StoredUser[]) {
  writeJson("users.json", users);
}

export function getSessions(): StoredSession[] {
  return readJson<StoredSession[]>("sessions.json", []);
}

export function saveSessions(sessions: StoredSession[]) {
  writeJson("sessions.json", sessions);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
