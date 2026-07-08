import { createServerFn } from "@tanstack/react-start";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Admin dashboard password. Override with the ADMIN_PASSWORD env var in
 * production if you want to rotate it without a code change.
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@Prefet3574";

// ---------------------------------------------------------------------------
// SQLite storage
//
// The site persists to a local SQLite file (.data/site.db) — no external
// database service needed. The preview/production server runs under Bun, so
// we use bun:sqlite; when the bundle runs under plain Node (e.g. the Vercel
// entry), we fall back to node:sqlite (Node 22.5+).
// ---------------------------------------------------------------------------

type Db = {
  run: (query: string, params?: (string | number)[]) => void;
  all: (query: string, params?: (string | number)[]) => Record<string, unknown>[];
};

let dbInstance: Db | null = null;

async function openDb(): Promise<Db> {
  if (dbInstance) return dbInstance;

  const dir = path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "site.db");

  // Import via a variable specifier so neither TypeScript nor Vite tries to
  // resolve the runtime-specific builtin at build time.
  let db: Db;
  try {
    const spec = "bun:sqlite";
    const { Database } = await import(/* @vite-ignore */ spec);
    const raw = new Database(file);
    raw.exec("pragma journal_mode = WAL");
    db = {
      run: (q, p = []) => raw.prepare(q).run(...p),
      all: (q, p = []) => raw.prepare(q).all(...p) as Record<string, unknown>[],
    };
  } catch {
    const spec = "node:sqlite";
    const { DatabaseSync } = await import(/* @vite-ignore */ spec);
    const raw = new DatabaseSync(file);
    raw.exec("pragma journal_mode = WAL");
    db = {
      run: (q, p = []) => raw.prepare(q).run(...p),
      all: (q, p = []) => raw.prepare(q).all(...p) as Record<string, unknown>[],
    };
  }

  db.run(`
    create table if not exists contact_submissions (
      id integer primary key autoincrement,
      name text not null,
      email text not null,
      phone text not null default '',
      service text not null default '',
      message text not null,
      created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`);
  db.run(`
    create table if not exists page_views (
      id integer primary key autoincrement,
      path text not null,
      referrer text not null default '',
      user_agent text not null default '',
      created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`);

  dbInstance = db;
  return db;
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: ContactInput) => {
    const name = String(data.name ?? "").trim().slice(0, 200);
    const email = String(data.email ?? "").trim().slice(0, 200);
    const phone = String(data.phone ?? "").trim().slice(0, 50);
    const service = String(data.service ?? "").trim().slice(0, 100);
    const message = String(data.message ?? "").trim().slice(0, 5000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please fill in your name, a valid email, and a message.");
    }
    return { name, email, phone, service, message };
  })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const db = await openDb();
      db.run(
        `insert into contact_submissions (name, email, phone, service, message)
         values (?, ?, ?, ?, ?)`,
        [data.name, data.email, data.phone, data.service, data.message],
      );
      return { ok: true };
    } catch (err) {
      console.error("contact submission failed:", err);
      return { ok: false };
    }
  });

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export const trackPageView = createServerFn({ method: "POST" })
  .inputValidator((data: { path: string; referrer: string; userAgent: string }) => ({
    path: String(data.path ?? "/").slice(0, 500),
    referrer: String(data.referrer ?? "").slice(0, 500),
    userAgent: String(data.userAgent ?? "").slice(0, 500),
  }))
  .handler(async ({ data }) => {
    // Analytics must never break the site — swallow every failure.
    try {
      const db = await openDb();
      db.run(
        `insert into page_views (path, referrer, user_agent) values (?, ?, ?)`,
        [data.path, data.referrer, data.userAgent],
      );
      return { ok: true };
    } catch (err) {
      console.error("page view tracking failed:", err);
      return { ok: false };
    }
  });

// ---------------------------------------------------------------------------
// Admin dashboard (password-protected)
// ---------------------------------------------------------------------------

export type AdminStats = {
  authorized: boolean;
  totalViews: number;
  viewsByDay: { day: string; views: number }[];
  topPages: { path: string; views: number }[];
  submissions: {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    created_at: string;
  }[];
};

const unauthorized: AdminStats = {
  authorized: false,
  totalViews: 0,
  viewsByDay: [],
  topPages: [],
  submissions: [],
};

export const getAdminStats = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => ({
    password: String(data.password ?? ""),
  }))
  .handler(async ({ data }): Promise<AdminStats> => {
    // The password check lives server-side so the data itself is protected,
    // not just the page that renders it.
    if (data.password !== ADMIN_PASSWORD) return unauthorized;

    try {
      const db = await openDb();
      const totals = db.all(`select count(*) as total from page_views`);
      const byDay = db.all(`
        select date(created_at) as day, count(*) as views
        from page_views
        where created_at > strftime('%Y-%m-%dT%H:%M:%fZ','now','-14 days')
        group by 1 order by 1`);
      const topPages = db.all(`
        select path, count(*) as views
        from page_views
        where created_at > strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 days')
        group by path order by views desc limit 10`);
      const submissions = db.all(`
        select id, name, email, phone, service, message, created_at
        from contact_submissions
        order by created_at desc limit 20`);

      return {
        authorized: true,
        totalViews: Number(totals[0]?.total ?? 0),
        viewsByDay: byDay.map((r) => ({ day: String(r.day), views: Number(r.views) })),
        topPages: topPages.map((r) => ({ path: String(r.path), views: Number(r.views) })),
        submissions: submissions.map((r) => ({
          id: Number(r.id),
          name: String(r.name),
          email: String(r.email),
          phone: String(r.phone),
          service: String(r.service),
          message: String(r.message),
          created_at: String(r.created_at),
        })),
      };
    } catch (err) {
      console.error("admin stats failed:", err);
      return { ...unauthorized, authorized: true };
    }
  });
