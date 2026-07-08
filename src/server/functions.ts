import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";

const dbConfigured = () => Boolean(process.env.DATABASE_URL);

/**
 * Lazily create the tables the site needs. Cached module-level so the DDL runs
 * at most once per server process; reset on failure so a transient error
 * doesn't poison every later request.
 */
let tablesReady: Promise<void> | null = null;
const ensureTables = () => {
  tablesReady ??= (async () => {
    const db = sql();
    await db`
      create table if not exists contact_submissions (
        id serial primary key,
        name text not null,
        email text not null,
        phone text not null default '',
        service text not null default '',
        message text not null,
        created_at timestamptz not null default now()
      )`;
    await db`
      create table if not exists page_views (
        id bigserial primary key,
        path text not null,
        referrer text not null default '',
        user_agent text not null default '',
        created_at timestamptz not null default now()
      )`;
  })().catch((err) => {
    tablesReady = null;
    throw err;
  });
  return tablesReady;
};

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
  .handler(async ({ data }): Promise<{ ok: boolean; error?: string }> => {
    if (!dbConfigured()) {
      // Site owner hasn't connected a database yet — tell the visitor to email
      // directly instead of silently dropping their message.
      return { ok: false, error: "not_configured" };
    }
    try {
      await ensureTables();
      await sql()`
        insert into contact_submissions (name, email, phone, service, message)
        values (${data.name}, ${data.email}, ${data.phone}, ${data.service}, ${data.message})`;
      return { ok: true };
    } catch (err) {
      console.error("contact submission failed:", err);
      return { ok: false, error: "server_error" };
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
    if (!dbConfigured()) return { ok: false };
    try {
      await ensureTables();
      await sql()`
        insert into page_views (path, referrer, user_agent)
        values (${data.path}, ${data.referrer}, ${data.userAgent})`;
      return { ok: true };
    } catch (err) {
      console.error("page view tracking failed:", err);
      return { ok: false };
    }
  });

// ---------------------------------------------------------------------------
// Admin dashboard
// ---------------------------------------------------------------------------

export type AdminStats = {
  configured: boolean;
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

export const getAdminStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminStats> => {
    const empty: AdminStats = {
      configured: false,
      totalViews: 0,
      viewsByDay: [],
      topPages: [],
      submissions: [],
    };
    if (!dbConfigured()) return empty;
    try {
      await ensureTables();
      const db = sql();
      const [totals, byDay, topPages, submissions] = await Promise.all([
        db`select count(*)::int as total from page_views`,
        db`
          select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
                 count(*)::int as views
          from page_views
          where created_at > now() - interval '14 days'
          group by 1 order by 1`,
        db`
          select path, count(*)::int as views
          from page_views
          where created_at > now() - interval '30 days'
          group by path order by views desc limit 10`,
        db`
          select id, name, email, phone, service, message, created_at
          from contact_submissions
          order by created_at desc limit 20`,
      ]);
      return {
        configured: true,
        totalViews: totals[0]?.total ?? 0,
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
      return empty;
    }
  },
);
