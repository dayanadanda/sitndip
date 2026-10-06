import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import type { Category, Message, Order, Product, Slide } from "./types";
import { seedCategories, seedProducts, seedSlides } from "./seed";

const dataDir = path.join(process.cwd(), "data");
const dbFile = path.join(dataDir, "sitndip.db");

const globalForDb = globalThis as unknown as { __sitndipDb?: Database.Database };

/**
 * One SQLite file holds everything: customers, sessions, orders, and the
 * catalog (products, categories, slider, messages).
 */
export function getDb(): Database.Database {
  if (globalForDb.__sitndipDb) return globalForDb.__sitndipDb;

  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(dbFile);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS records (
      kind TEXT NOT NULL,
      id TEXT NOT NULL,
      position INTEGER NOT NULL,
      data TEXT NOT NULL,
      PRIMARY KEY (kind, id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      phone TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      total REAL NOT NULL,
      customer TEXT NOT NULL,
      items TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id);
  `);

  globalForDb.__sitndipDb = db;
  importLegacyOrders(db);
  return db;
}

function readLegacy<T>(file: string): T | null {
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

function isInitialised(db: Database.Database, kind: string) {
  return Boolean(db.prepare("SELECT 1 FROM meta WHERE key = ?").get(`init:${kind}`));
}

function markInitialised(db: Database.Database, kind: string) {
  db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, '1')").run(`init:${kind}`);
}

function writeList<T extends { id: string }>(kind: string, items: T[]) {
  const db = getDb();
  const insert = db.prepare(
    "INSERT INTO records (kind, id, position, data) VALUES (?, ?, ?, ?)",
  );
  db.transaction(() => {
    db.prepare("DELETE FROM records WHERE kind = ?").run(kind);
    items.forEach((item, index) => insert.run(kind, item.id, index, JSON.stringify(item)));
    markInitialised(db, kind);
  })();
}

/**
 * Reads a list from the database. The first time a list is read it is filled
 * from the old JSON file (if there is one) or from the starter data.
 */
function readList<T extends { id: string }>(kind: string, legacyFile: string, seed: T[]): T[] {
  const db = getDb();
  if (!isInitialised(db, kind)) {
    writeList(kind, readLegacy<T[]>(legacyFile) ?? seed);
  }
  const rows = db
    .prepare("SELECT data FROM records WHERE kind = ? ORDER BY position ASC")
    .all(kind) as { data: string }[];
  return rows.map((row) => JSON.parse(row.data) as T);
}

export function getProducts(): Product[] {
  return readList<Product>("products", "products.json", seedProducts);
}

export function saveProducts(products: Product[]) {
  writeList("products", products);
}

export function getCategories(): Category[] {
  const categories = readList<Category>("categories", "categories.json", seedCategories);
  return categories.length ? categories : seedCategories;
}

export function saveCategories(categories: Category[]) {
  writeList("categories", categories);
}

export function getSlides(): Slide[] {
  const slides = readList<Slide>("slides", "slides.json", seedSlides);
  return slides.length ? slides : seedSlides;
}

export function saveSlides(slides: Slide[]) {
  writeList("slides", slides);
}

export function getMessages(): Message[] {
  return readList<Message>("messages", "messages.json", []);
}

export function saveMessages(messages: Message[]) {
  writeList("messages", messages);
}

type OrderRow = {
  id: string;
  user_id: string | null;
  total: number;
  customer: string;
  items: string;
  created_at: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    total: row.total,
    customer: JSON.parse(row.customer),
    items: JSON.parse(row.items),
    createdAt: row.created_at,
  };
}

export function addOrder(order: Order) {
  getDb()
    .prepare(
      "INSERT INTO orders (id, user_id, total, customer, items, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .run(
      order.id,
      order.userId ?? null,
      order.total,
      JSON.stringify(order.customer),
      JSON.stringify(order.items),
      order.createdAt,
    );
}

export function getOrders(): Order[] {
  const rows = getDb()
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all() as OrderRow[];
  return rows.map(rowToOrder);
}

export function getOrdersForUser(userId: string): Order[] {
  const rows = getDb()
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as OrderRow[];
  return rows.map(rowToOrder);
}

function importLegacyOrders(db: Database.Database) {
  if (isInitialised(db, "orders")) return;
  const legacy = readLegacy<Order[]>("orders.json") ?? [];
  const insert = db.prepare(
    "INSERT OR IGNORE INTO orders (id, user_id, total, customer, items, created_at) VALUES (?, NULL, ?, ?, ?, ?)",
  );
  db.transaction(() => {
    for (const order of legacy) {
      insert.run(
        order.id,
        order.total,
        JSON.stringify(order.customer),
        JSON.stringify(order.items),
        order.createdAt,
      );
    }
    markInitialised(db, "orders");
  })();
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
