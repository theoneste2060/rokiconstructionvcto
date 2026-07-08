import { createServerFn } from "@tanstack/react-start";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { contentKeys, defaultContent, type SiteContent } from "~/data/content";

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
  db.run(`
    create table if not exists site_content (
      key text primary key,
      value text not null,
      updated_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`);

  dbInstance = db;
  return db;
}

// ---------------------------------------------------------------------------
// Site content (editable from /admin)
// ---------------------------------------------------------------------------

/**
 * Full site content: the defaults from ~/data/content overlaid with any
 * documents saved from the admin Content editor. Saved values replace the
 * default for their key wholesale (the editor always writes complete
 * documents), and unparseable rows fall back to the default.
 */
export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => {
    const merged: SiteContent = { ...defaultContent };
    try {
      const db = await openDb();
      const rows = db.all(`select key, value from site_content`);
      for (const row of rows) {
        const key = String(row.key) as keyof SiteContent;
        if (!contentKeys.includes(key)) continue;
        try {
          (merged as Record<string, unknown>)[key] = JSON.parse(String(row.value));
        } catch {
          // keep the default for this key
        }
      }
    } catch (err) {
      console.error("getSiteContent failed, serving defaults:", err);
    }
    return merged;
  },
);

export const saveSiteContent = createServerFn({ method: "POST" })
  .validator((data: { password: string; key: string; value: unknown }) => {
    const key = String(data.key ?? "");
    if (!contentKeys.includes(key as keyof SiteContent)) {
      throw new Error(`Unknown content key: ${key}`);
    }
    return { password: String(data.password ?? ""), key, value: data.value };
  })
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || data.password !== adminPassword) {
      return { ok: false, error: "unauthorized" };
    }
    try {
      const db = await openDb();
      db.run(
        `insert into site_content (key, value, updated_at)
         values (?, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))
         on conflict(key) do update set value = excluded.value, updated_at = excluded.updated_at`,
        [data.key, JSON.stringify(data.value)],
      );
      return { ok: true };
    } catch (err) {
      console.error("saveSiteContent failed:", err);
      return { ok: false, error: "server_error" };
    }
  });

/** Reset one content key back to the built-in default. */
export const resetSiteContent = createServerFn({ method: "POST" })
  .validator((data: { password: string; key: string }) => ({
    password: String(data.password ?? ""),
    key: String(data.key ?? ""),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || data.password !== adminPassword) return { ok: false };
    try {
      const db = await openDb();
      db.run(`delete from site_content where key = ?`, [data.key]);
      return { ok: true };
    } catch (err) {
      console.error("resetSiteContent failed:", err);
      return { ok: false };
    }
  });

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
  .validator((data: ContactInput) => {
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
  .validator((data: { path: string; referrer: string; userAgent: string }) => ({
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
  /** False when the ADMIN_PASSWORD env var isn't set, so the UI can say so. */
  passwordSet: boolean;
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
  passwordSet: true,
  totalViews: 0,
  viewsByDay: [],
  topPages: [],
  submissions: [],
};

export const getAdminStats = createServerFn({ method: "POST" })
  .validator((data: { password: string }) => ({
    password: String(data.password ?? ""),
  }))
  .handler(async ({ data }): Promise<AdminStats> => {
    // The password check lives server-side so the data itself is protected,
    // not just the page that renders it. The password comes exclusively from
    // the ADMIN_PASSWORD environment variable — never hardcode it. Read at
    // request time (not module load) so serverless runtimes pick it up too.
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return { ...unauthorized, passwordSet: false };
    if (data.password !== adminPassword) return unauthorized;

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
        passwordSet: true,
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
