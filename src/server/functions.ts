import { createServerFn } from "@tanstack/react-start";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
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
  db.run(`
    create table if not exists newsletter_subscribers (
      id integer primary key autoincrement,
      email text not null unique,
      created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`);
  db.run(`
    create table if not exists admin_users (
      id integer primary key autoincrement,
      username text not null unique,
      password_hash text not null,
      salt text not null,
      role text not null default 'admin',
      created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    )`);

  // Bootstrap: the ADMIN_PASSWORD env var seeds the first super admin
  // (username "admin"). After that, accounts live in the database and are
  // managed from the Users section; the env var is only a first-run seed.
  const userCount = Number(db.all(`select count(*) as c from admin_users`)[0]?.c ?? 0);
  if (userCount === 0 && process.env.ADMIN_PASSWORD) {
    const salt = randomBytes(16).toString("hex");
    db.run(
      `insert into admin_users (username, password_hash, salt, role) values (?, ?, ?, 'super')`,
      ["admin", hashPassword(process.env.ADMIN_PASSWORD, salt), salt],
    );
  }

  dbInstance = db;
  return db;
}

// ---------------------------------------------------------------------------
// Admin accounts & authentication
// ---------------------------------------------------------------------------

export type AdminRole = "super" | "admin";
export type AdminAuth = { username: string; password: string };
export type AdminUser = { id: number; username: string; role: AdminRole; created_at: string };

const hashPassword = (password: string, salt: string) =>
  createHash("sha256").update(`${salt}:${password}`).digest("hex");

const cleanAuth = (data: { username?: unknown; password?: unknown }): AdminAuth => ({
  username: String(data.username ?? "").trim().toLowerCase().slice(0, 40),
  password: String(data.password ?? ""),
});

/** Verify credentials against admin_users; returns the account or null. */
function verifyUser(db: Db, auth: AdminAuth): { id: number; username: string; role: AdminRole } | null {
  if (!auth.username || !auth.password) return null;
  const row = db.all(`select id, username, password_hash, salt, role from admin_users where username = ?`, [auth.username])[0];
  if (!row) return null;
  if (hashPassword(auth.password, String(row.salt)) !== String(row.password_hash)) return null;
  return { id: Number(row.id), username: String(row.username), role: row.role === "super" ? "super" : "admin" };
}

async function requireSuper(auth: AdminAuth) {
  const db = await openDb();
  const user = verifyUser(db, auth);
  if (!user || user.role !== "super") return null;
  return { db, user };
}

const validUsername = (u: string) => /^[a-z0-9_.-]{3,40}$/.test(u);

export const listAdminUsers = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth }) => ({ auth: cleanAuth(data.auth ?? {}) }))
  .handler(async ({ data }): Promise<{ ok: boolean; users: AdminUser[] }> => {
    try {
      const ctx = await requireSuper(data.auth);
      if (!ctx) return { ok: false, users: [] };
      const users = ctx.db.all(`select id, username, role, created_at from admin_users order by created_at`).map((r) => ({
        id: Number(r.id),
        username: String(r.username),
        role: (r.role === "super" ? "super" : "admin") as AdminRole,
        created_at: String(r.created_at),
      }));
      return { ok: true, users };
    } catch (err) {
      console.error("listAdminUsers failed:", err);
      return { ok: false, users: [] };
    }
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth; username: string; password: string; role: string }) => ({
    auth: cleanAuth(data.auth ?? {}),
    username: String(data.username ?? "").trim().toLowerCase().slice(0, 40),
    password: String(data.password ?? ""),
    role: data.role === "super" ? "super" : "admin",
  }))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const ctx = await requireSuper(data.auth);
      if (!ctx) return { ok: false, error: "Only a super admin can manage users." };
      if (!validUsername(data.username)) return { ok: false, error: "Username must be 3-40 chars: letters, numbers, dots, dashes." };
      if (data.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
      if (ctx.db.all(`select id from admin_users where username = ?`, [data.username]).length > 0) {
        return { ok: false, error: "That username already exists." };
      }
      const salt = randomBytes(16).toString("hex");
      ctx.db.run(
        `insert into admin_users (username, password_hash, salt, role) values (?, ?, ?, ?)`,
        [data.username, hashPassword(data.password, salt), salt, data.role],
      );
      return { ok: true };
    } catch (err) {
      console.error("createAdminUser failed:", err);
      return { ok: false, error: "Server error." };
    }
  });

export const setAdminUserRole = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth; id: number; role: string }) => ({
    auth: cleanAuth(data.auth ?? {}),
    id: Number(data.id),
    role: data.role === "super" ? "super" : "admin",
  }))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const ctx = await requireSuper(data.auth);
      if (!ctx) return { ok: false, error: "Only a super admin can manage users." };
      if (data.role !== "super") {
        const supers = ctx.db.all(`select id from admin_users where role = 'super'`);
        if (supers.length === 1 && Number(supers[0].id) === data.id) {
          return { ok: false, error: "Cannot demote the last super admin." };
        }
      }
      ctx.db.run(`update admin_users set role = ? where id = ?`, [data.role, data.id]);
      return { ok: true };
    } catch (err) {
      console.error("setAdminUserRole failed:", err);
      return { ok: false, error: "Server error." };
    }
  });

export const resetAdminUserPassword = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth; id: number; password: string }) => ({
    auth: cleanAuth(data.auth ?? {}),
    id: Number(data.id),
    password: String(data.password ?? ""),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const ctx = await requireSuper(data.auth);
      if (!ctx) return { ok: false, error: "Only a super admin can reset passwords." };
      if (data.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
      const salt = randomBytes(16).toString("hex");
      ctx.db.run(`update admin_users set password_hash = ?, salt = ? where id = ?`, [
        hashPassword(data.password, salt),
        salt,
        data.id,
      ]);
      return { ok: true };
    } catch (err) {
      console.error("resetAdminUserPassword failed:", err);
      return { ok: false, error: "Server error." };
    }
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth; id: number }) => ({
    auth: cleanAuth(data.auth ?? {}),
    id: Number(data.id),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const ctx = await requireSuper(data.auth);
      if (!ctx) return { ok: false, error: "Only a super admin can manage users." };
      const target = ctx.db.all(`select role from admin_users where id = ?`, [data.id])[0];
      if (!target) return { ok: false, error: "User not found." };
      if (target.role === "super") {
        const supers = ctx.db.all(`select id from admin_users where role = 'super'`);
        if (supers.length <= 1) return { ok: false, error: "Cannot delete the last super admin." };
      }
      ctx.db.run(`delete from admin_users where id = ?`, [data.id]);
      return { ok: true };
    } catch (err) {
      console.error("deleteAdminUser failed:", err);
      return { ok: false, error: "Server error." };
    }
  });

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
  .validator((data: { auth: AdminAuth; key: string; value: unknown }) => {
    const key = String(data.key ?? "");
    if (!contentKeys.includes(key as keyof SiteContent)) {
      throw new Error(`Unknown content key: ${key}`);
    }
    return { auth: cleanAuth(data.auth ?? {}), key, value: data.value };
  })
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const db = await openDb();
      if (!verifyUser(db, data.auth)) return { ok: false, error: "unauthorized" };
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
  .validator((data: { auth: AdminAuth; key: string }) => ({
    auth: cleanAuth(data.auth ?? {}),
    key: String(data.key ?? ""),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const db = await openDb();
      if (!verifyUser(db, data.auth)) return { ok: false };
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
  /** Role of the authenticated account; null when unauthorized. */
  role: AdminRole | null;
  /** Signed-in username; empty when unauthorized. */
  username: string;
  /** False when no accounts exist AND no ADMIN_PASSWORD env var to seed one. */
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
  subscribers: { id: number; email: string; created_at: string }[];
};

const unauthorized: AdminStats = {
  authorized: false,
  role: null,
  username: "",
  passwordSet: true,
  totalViews: 0,
  viewsByDay: [],
  topPages: [],
  submissions: [],
  subscribers: [],
};

export const getAdminStats = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => cleanAuth(data))
  .handler(async ({ data }): Promise<AdminStats> => {
    // Credentials are checked server-side against the admin_users table so the
    // data itself is protected, not just the page that renders it. The first
    // account is seeded from ADMIN_PASSWORD (username "admin") in openDb.
    try {
      const db = await openDb();
      const userCount = Number(db.all(`select count(*) as c from admin_users`)[0]?.c ?? 0);
      if (userCount === 0 && !process.env.ADMIN_PASSWORD) {
        return { ...unauthorized, passwordSet: false };
      }
      const account = verifyUser(db, data);
      if (!account) return unauthorized;
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
      const subscribers = db.all(`
        select id, email, created_at from newsletter_subscribers
        order by created_at desc limit 50`);

      return {
        authorized: true,
        role: account.role,
        username: account.username,
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
        subscribers: subscribers.map((r) => ({
          id: Number(r.id),
          email: String(r.email),
          created_at: String(r.created_at),
        })),
      };
    } catch (err) {
      console.error("admin stats failed:", err);
      return unauthorized;
    }
  });


// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => {
    const email = String(data.email ?? "").trim().toLowerCase().slice(0, 200);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please enter a valid email address.");
    }
    return { email };
  })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    try {
      const db = await openDb();
      db.run(`insert into newsletter_subscribers (email) values (?) on conflict(email) do nothing`, [data.email]);
      return { ok: true };
    } catch (err) {
      console.error("newsletter subscribe failed:", err);
      return { ok: false };
    }
  });

// ---------------------------------------------------------------------------
// Image library (upload + list) for the admin editor
// ---------------------------------------------------------------------------

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const listImages = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth }) => ({ auth: cleanAuth(data.auth ?? {}) }))
  .handler(async ({ data }): Promise<{ ok: boolean; images: string[] }> => {
    try {
      const db = await openDb();
      if (!verifyUser(db, data.auth)) return { ok: false, images: [] };
      const base = path.join(process.cwd(), "public", "images");
      const scan = (dir: string, prefix: string): string[] => {
        if (!existsSync(dir)) return [];
        return readdirSync(dir, { withFileTypes: true })
          .filter((e) => e.isFile() && IMAGE_EXTENSIONS.has(e.name.split(".").pop()?.toLowerCase() ?? ""))
          .map((e) => `${prefix}/${e.name}`);
      };
      // uploads first (newest naming sorts last, so reverse), then the stock set
      const uploads = scan(path.join(base, "uploads"), "/images/uploads").sort().reverse();
      const stock = scan(base, "/images").sort();
      return { ok: true, images: [...uploads, ...stock] };
    } catch (err) {
      console.error("listImages failed:", err);
      return { ok: false, images: [] };
    }
  });

export const uploadImage = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth; filename: string; dataBase64: string }) => ({
    auth: cleanAuth(data.auth ?? {}),
    filename: String(data.filename ?? "image.png"),
    dataBase64: String(data.dataBase64 ?? ""),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean; path?: string; error?: string }> => {
    try {
      const db = await openDb();
      if (!verifyUser(db, data.auth)) return { ok: false, error: "Unauthorized." };

      const ext = data.filename.split(".").pop()?.toLowerCase() ?? "";
      if (!IMAGE_EXTENSIONS.has(ext)) {
        return { ok: false, error: "Only PNG, JPG, WEBP, or GIF images are allowed." };
      }
      const bytes = Buffer.from(data.dataBase64, "base64");
      if (bytes.length === 0) return { ok: false, error: "Empty file." };
      if (bytes.length > MAX_UPLOAD_BYTES) return { ok: false, error: "Image is too large (max 8 MB)." };

      const stem = data.filename
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || "image";
      const name = `${Date.now()}-${stem}.${ext}`;

      // Persist in public/ (survives rebuilds — vite copies it into the next
      // build) and mirror into the live dist/client so it serves immediately.
      const publicDir = path.join(process.cwd(), "public", "images", "uploads");
      mkdirSync(publicDir, { recursive: true });
      writeFileSync(path.join(publicDir, name), bytes);
      try {
        const distDir = path.join(process.cwd(), "dist", "client", "images", "uploads");
        mkdirSync(distDir, { recursive: true });
        writeFileSync(path.join(distDir, name), bytes);
      } catch {
        // no dist (dev server) — public/ alone is enough there
      }
      return { ok: true, path: `/images/uploads/${name}` };
    } catch (err) {
      console.error("uploadImage failed:", err);
      return { ok: false, error: "Upload failed on the server." };
    }
  });

// ---------------------------------------------------------------------------
// Self-service profile
// ---------------------------------------------------------------------------

export const updateOwnProfile = createServerFn({ method: "POST" })
  .validator((data: { auth: AdminAuth; newUsername?: string; newPassword?: string }) => ({
    auth: cleanAuth(data.auth ?? {}),
    newUsername: String(data.newUsername ?? "").trim().toLowerCase().slice(0, 40),
    newPassword: String(data.newPassword ?? ""),
  }))
  .handler(async ({ data }): Promise<{ ok: boolean; username?: string; error?: string }> => {
    try {
      const db = await openDb();
      const account = verifyUser(db, data.auth);
      if (!account) return { ok: false, error: "Unauthorized." };

      let username = account.username;
      if (data.newUsername && data.newUsername !== account.username) {
        if (!validUsername(data.newUsername)) {
          return { ok: false, error: "Username must be 3-40 chars: letters, numbers, dots, dashes." };
        }
        if (db.all(`select id from admin_users where username = ?`, [data.newUsername]).length > 0) {
          return { ok: false, error: "That username is already taken." };
        }
        db.run(`update admin_users set username = ? where id = ?`, [data.newUsername, account.id]);
        username = data.newUsername;
      }
      if (data.newPassword) {
        if (data.newPassword.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
        const salt = randomBytes(16).toString("hex");
        db.run(`update admin_users set password_hash = ?, salt = ? where id = ?`, [
          hashPassword(data.newPassword, salt),
          salt,
          account.id,
        ]);
      }
      return { ok: true, username };
    } catch (err) {
      console.error("updateOwnProfile failed:", err);
      return { ok: false, error: "Server error." };
    }
  });
