import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "~/components/ThemeProvider";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminStats,
  listAdminUsers,
  resetAdminUserPassword,
  setAdminUserRole,
  type AdminAuth,
  type AdminStats,
  type AdminUser,
} from "~/server/functions";
import { ContentEditor } from "~/components/admin/ContentEditor";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Site Dashboard — ROKI Construction" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

const serviceLabels: Record<string, string> = {
  architectural: "Architectural Design",
  geotechnical: "Geotechnical Engineering",
  sustainability: "Sustainability Consulting",
  landscaping: "Landscaping & Site Dev",
  management: "Project Management",
  other: "Other / Multiple",
};

const AUTH_KEY = "roki-admin-auth";
const LAST_SEEN_KEY = "roki-admin-last-seen-submission";
const POLL_MS = 30_000;

type Section = "overview" | "content" | "users" | "analytics" | "submissions";

const sections: { id: Section; label: string; superOnly?: boolean; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: "content",
    label: "Content",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    id: "users",
    label: "Users",
    superOnly: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: "submissions",
    label: "Submissions",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
      </svg>
    ),
  },
];

const readStoredAuth = (): AdminAuth | null => {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.username === "string" && typeof parsed?.password === "string") return parsed;
  } catch {
    /* corrupted/legacy value */
  }
  sessionStorage.removeItem(AUTH_KEY);
  return null;
};

function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [auth, setAuth] = useState<AdminAuth | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);
  const [passwordSet, setPasswordSet] = useState(true);

  const authenticate = async (candidate: AdminAuth, opts: { silent: boolean }) => {
    setChecking(true);
    setError(false);
    try {
      const result = await getAdminStats({ data: candidate });
      setPasswordSet(result.passwordSet);
      if (result.authorized) {
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(candidate));
        setAuth(candidate);
        setStats(result);
      } else {
        sessionStorage.removeItem(AUTH_KEY);
        if (!opts.silent) setError(result.passwordSet);
      }
    } catch {
      if (!opts.silent) setError(true);
    } finally {
      setChecking(false);
    }
  };

  // Re-use credentials remembered earlier in this browser session.
  useEffect(() => {
    const saved = readStoredAuth();
    if (saved) {
      void authenticate(saved, { silent: true });
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || checking) return;
    void authenticate({ username: username.trim().toLowerCase(), password }, { silent: false });
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setStats(null);
    setAuth(null);
    setUsername("");
    setPassword("");
  };

  if (!stats?.authorized || !auth) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-[#2a5e40] px-4">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex flex-col items-center gap-3">
              <img
                src="/images/roki-logo.png"
                alt="ROKI Construction Ltd logo"
                className="h-16 w-16 rounded-2xl bg-white p-1 shadow-lg"
              />
              <span className="text-center">
                <span className="block font-display text-2xl font-extrabold tracking-[0.12em] text-white">ROKI</span>
                <span className="block mt-1 text-[10px] font-semibold tracking-[0.3em] text-white/70">CONSTRUCTION</span>
              </span>
            </Link>
          </div>
          <form onSubmit={handleLogin} className="p-8 rounded-2xl bg-white dark:bg-dark-card shadow-2xl">
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white font-display">
              Site Dashboard
            </h1>
            <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
              Sign in to manage the website.
            </p>
            <label className="block mt-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoFocus
                autoCapitalize="none"
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 font-normal focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </label>
            <label className="block mt-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 font-normal focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </label>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                Incorrect username or password. Please try again.
              </p>
            )}
            {!passwordSet && (
              <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
                No admin account exists yet. Set the{" "}
                <code className="font-mono text-xs">ADMIN_PASSWORD</code> environment variable on
                the server — it seeds the first super admin (username{" "}
                <code className="font-mono text-xs">admin</code>).
              </p>
            )}
            <button
              type="submit"
              disabled={checking || !username || !password}
              className="mt-6 w-full px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checking ? "Checking…" : "Sign In"}
            </button>
            <Link
              to="/"
              className="mt-4 block text-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              ← Back to website
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard stats={stats} auth={auth} onStats={setStats} onLogout={handleLogout} />;
}

// ---------------------------------------------------------------------------
// Dashboard shell: green sidebar + green top bar
// ---------------------------------------------------------------------------

function Dashboard({
  stats,
  auth,
  onStats,
  onLogout,
}: {
  stats: AdminStats;
  auth: AdminAuth;
  onStats: (s: AdminStats) => void;
  onLogout: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const [section, setSection] = useState<Section>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"bell" | "profile" | null>(null);
  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof localStorage === "undefined") return 0;
    return Number(localStorage.getItem(LAST_SEEN_KEY) ?? 0);
  });

  const visibleSections = sections.filter((s) => !s.superOnly || stats.role === "super");
  const closeMenus = () => setOpenMenu(null);

  // Live refresh: poll for new submissions/views while the dashboard is open.
  const authRef = useRef(auth);
  authRef.current = auth;
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const fresh = await getAdminStats({ data: authRef.current });
        if (fresh.authorized) onStats(fresh);
      } catch {
        /* keep showing the last good data */
      }
    }, POLL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notifications: everything newer than the last-seen submission id is unseen.
  const maxId = Math.max(0, ...stats.submissions.map((s) => s.id));
  const unseenCount = stats.submissions.filter((s) => s.id > lastSeen).length;
  const notifications = stats.submissions.slice(0, 5);

  const openBell = () => {
    const next = openMenu === "bell" ? null : "bell";
    setOpenMenu(next);
    if (next === "bell") {
      // Viewing the list marks everything as seen.
      setLastSeen(maxId);
      localStorage.setItem(LAST_SEEN_KEY, String(maxId));
    }
  };

  const goTo = (s: Section) => {
    setSection(s);
    setMobileOpen(false);
    closeMenus();
  };

  const sidebarNav = (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {visibleSections.map((item) => {
        const active = section === item.id;
        return (
          <button
            key={item.id}
            onClick={() => goTo(item.id)}
            title={collapsed ? item.label : undefined}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              collapsed ? "justify-center" : ""
            } ${
              active
                ? "bg-white text-primary shadow-md"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.id === "submissions" && unseenCount > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-accent text-white">
                {unseenCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const sidebarFooter = (
    <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-4">
      <Link
        to="/"
        title={collapsed ? "View Website" : undefined}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
        </svg>
        {!collapsed && <span>View Website</span>}
      </Link>
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : undefined}
        className={`hidden md:flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
        </svg>
        {!collapsed && <span>Collapse</span>}
      </button>
    </div>
  );

  const sidebarBrand = (
    <div className={`h-16 flex items-center border-b border-white/10 ${collapsed ? "justify-center px-2" : "px-5"}`}>
      <Link to="/" className="flex items-center gap-2.5">
        <img
          src="/images/roki-logo.png"
          alt="ROKI Construction Ltd logo"
          className="h-9 w-9 rounded-lg bg-white p-[3px]"
        />
        {!collapsed && (
          <span className="flex flex-col justify-center leading-none">
            <span className="font-display text-lg font-extrabold tracking-[0.12em] text-white">ROKI</span>
            <span className="mt-1 text-[8px] font-semibold tracking-[0.28em] text-white/60">CONSTRUCTION</span>
          </span>
        )}
      </Link>
    </div>
  );

  return (
    <div className="min-h-dvh flex bg-gray-50 dark:bg-dark-bg">
      {/* ===== Sidebar (desktop) — brand green ===== */}
      <aside
        className={`hidden md:flex flex-col shrink-0 sticky top-0 h-dvh bg-primary dark:bg-primary-dark border-r border-black/10 transition-[width] duration-300 ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        {sidebarBrand}
        {sidebarNav}
        {sidebarFooter}
      </aside>

      {/* ===== Sidebar (mobile slide-over) ===== */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-primary dark:bg-primary-dark">
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <img src="/images/roki-logo.png" alt="ROKI" className="h-9 w-9 rounded-lg bg-white p-[3px]" />
                <span className="font-display text-lg font-extrabold tracking-[0.12em] text-white">ROKI</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-white/80 hover:bg-white/10"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarNav}
            {sidebarFooter}
          </aside>
        </div>
      )}

      {/* ===== Main column ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Click-away layer for the top-bar dropdowns. Lives outside the header
            because its backdrop-blur creates a containing block that would trap
            a fixed-position child inside the 64px bar. */}
        {openMenu && <div className="fixed inset-0 z-30" onClick={closeMenus} />}

        {/* ===== Top bar — brand green ===== */}
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 bg-primary/95 dark:bg-primary-dark/95 backdrop-blur-md border-b border-black/10 text-white">
          {/* Left: menu toggle + section title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:inline-flex p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="md:hidden flex items-center gap-2">
              <img src="/images/roki-logo.png" alt="ROKI" className="h-8 w-8 rounded-lg bg-white p-[2px]" />
            </div>
            <h1 className="hidden md:block text-lg font-bold text-white font-display truncate">
              {sections.find((s) => s.id === section)?.label}
            </h1>
          </div>

          {/* Right: theme, notifications, profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={openBell}
                className="relative p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unseenCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-accent rounded-full">
                    {unseenCount > 9 ? "9+" : unseenCount}
                  </span>
                )}
              </button>

              {openMenu === "bell" && (
                <div className="absolute right-0 mt-2 w-80 z-50 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden text-gray-900 dark:text-white">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 font-semibold text-sm">
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No new enquiries yet.
                    </p>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
                      {notifications.map((s) => (
                        <li key={s.id}>
                          <button
                            onClick={() => goTo("submissions")}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold">{s.name}</span>
                              <span className="text-[11px] text-gray-400 shrink-0">
                                {new Date(s.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{s.message}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => goTo("submissions")}
                    className="w-full px-4 py-3 text-sm font-semibold text-primary dark:text-primary-light hover:bg-gray-50 dark:hover:bg-gray-800/40 border-t border-gray-200 dark:border-gray-800 transition-colors"
                  >
                    View all submissions
                  </button>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === "profile" ? null : "profile")}
                className="flex items-center gap-2 p-1.5 sm:pl-2 sm:pr-3 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Account menu"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-primary text-xs font-bold uppercase">
                  {stats.username.slice(0, 2)}
                </span>
                <span className="hidden sm:block text-left">
                  <span className="block text-sm font-semibold text-white leading-tight">{stats.username}</span>
                  <span className="block text-[11px] text-white/60 leading-tight capitalize">
                    {stats.role === "super" ? "Super Admin" : "Admin"}
                  </span>
                </span>
                <svg
                  className={`hidden sm:block w-4 h-4 text-white/60 transition-transform duration-200 ${openMenu === "profile" ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {openMenu === "profile" && (
                <div className="absolute right-0 mt-2 w-56 z-50 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{stats.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {stats.role === "super" ? "Super Admin" : "Admin"} · Site dashboard
                    </div>
                  </div>
                  <Link
                    to="/"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
                    </svg>
                    View Website
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border-t border-gray-100 dark:border-gray-800/60 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===== Content ===== */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {section === "overview" && <OverviewSection stats={stats} onSeeAll={() => goTo("submissions")} />}
          {section === "content" && <ContentEditor auth={auth} />}
          {section === "users" && stats.role === "super" && <UsersSection auth={auth} />}
          {section === "analytics" && <AnalyticsSection stats={stats} />}
          {section === "submissions" && <SubmissionsSection stats={stats} />}

          <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
            Data is stored in the site's local SQLite database (.data/site.db). The dashboard unlocks
            for this browser session only.
          </p>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Users (super admin only)
// ---------------------------------------------------------------------------

function UsersSection({ auth }: { auth: AdminAuth }) {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "super">("admin");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const result = await listAdminUsers({ data: { auth } }).catch(() => ({ ok: false, users: [] }));
    setUsers(result.users);
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const report = (result: { ok: boolean; error?: string }, okText: string) => {
    setMessage(result.ok ? { kind: "ok", text: okText } : { kind: "error", text: result.error ?? "Something went wrong." });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const result = await createAdminUser({
      data: { auth, username: newUsername, password: newPassword, role: newRole },
    }).catch(() => ({ ok: false, error: "Server error." }));
    report(result, `User "${newUsername.trim().toLowerCase()}" created.`);
    if (result.ok) {
      setNewUsername("");
      setNewPassword("");
      setNewRole("admin");
      await load();
    }
    setBusy(false);
  };

  const handleRole = async (user: AdminUser, role: "admin" | "super") => {
    const result = await setAdminUserRole({ data: { auth, id: user.id, role } }).catch(() => ({ ok: false, error: "Server error." }));
    report(result, `"${user.username}" is now ${role === "super" ? "a Super Admin" : "an Admin"}.`);
    await load();
  };

  const handleReset = async (user: AdminUser) => {
    const password = window.prompt(`New password for "${user.username}" (min 6 characters):`);
    if (!password) return;
    const result = await resetAdminUserPassword({ data: { auth, id: user.id, password } }).catch(() => ({ ok: false, error: "Server error." }));
    report(result, `Password for "${user.username}" has been reset.`);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Delete user "${user.username}"? They will no longer be able to sign in.`)) return;
    const result = await deleteAdminUser({ data: { auth, id: user.id } }).catch(() => ({ ok: false, error: "Server error." }));
    report(result, `User "${user.username}" deleted.`);
    await load();
  };

  const inputCls =
    "px-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary";

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            message.kind === "ok"
              ? "bg-primary/10 text-primary-dark dark:text-primary-light border border-primary/30"
              : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add user */}
      <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-gray-900 dark:text-white">Add User</h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Admins can edit content and see enquiries. Super Admins can also manage users.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3">
          <input
            className={inputCls}
            placeholder="username"
            value={newUsername}
            autoCapitalize="none"
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <input
            className={inputCls}
            type="password"
            placeholder="password (min 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <select className={inputCls} value={newRole} onChange={(e) => setNewRole(e.target.value === "super" ? "super" : "admin")}>
            <option value="admin">Admin</option>
            <option value="super">Super Admin</option>
          </select>
          <button
            type="submit"
            disabled={busy || !newUsername || newPassword.length < 6}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </form>

      {/* Users table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold text-gray-900 dark:text-white">Accounts</h2>
        {users === null ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading users…</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <th className="py-3 pr-4">Username</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3 pr-4">Created</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800/60">
                    <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">{u.username}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRole(u, e.target.value === "super" ? "super" : "admin")}
                        className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="super">Super Admin</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs text-gray-500 dark:text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleReset(u)}
                        className="px-3 py-1.5 text-xs font-semibold text-primary dark:text-primary-light border border-primary/40 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="ml-2 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats sections
// ---------------------------------------------------------------------------

function StatTiles({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        { label: "Total Page Views", value: stats.totalViews.toLocaleString() },
        {
          label: "Views (last 14 days)",
          value: stats.viewsByDay.reduce((sum, d) => sum + d.views, 0).toLocaleString(),
        },
        { label: "Recent Submissions", value: String(stats.submissions.length) },
      ].map((tile) => (
        <div
          key={tile.label}
          className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800"
        >
          <div className="text-3xl font-bold text-primary dark:text-primary-light">{tile.value}</div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}

function DailyViewsCard({ stats }: { stats: AdminStats }) {
  const maxDay = Math.max(1, ...stats.viewsByDay.map((d) => d.views));
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
      <h2 className="font-semibold text-gray-900 dark:text-white">Daily Views (14 days)</h2>
      {stats.viewsByDay.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No page views recorded yet.</p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {stats.viewsByDay.map((d) => (
            <li key={d.day} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 font-mono text-xs text-gray-500 dark:text-gray-400">{d.day}</span>
              <span className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(4, (d.views / maxDay) * 100)}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-semibold text-gray-900 dark:text-white">{d.views}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TopPagesCard({ stats }: { stats: AdminStats }) {
  const maxPage = Math.max(1, ...stats.topPages.map((p) => p.views));
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
      <h2 className="font-semibold text-gray-900 dark:text-white">Top Pages (30 days)</h2>
      {stats.topPages.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No page views recorded yet.</p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {stats.topPages.map((p) => (
            <li key={p.path} className="flex items-center gap-3 text-sm">
              <span className="w-40 shrink-0 truncate font-mono text-xs text-gray-600 dark:text-gray-300">{p.path}</span>
              <span className="flex-1 h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${Math.max(4, (p.views / maxPage) * 100)}%` }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-semibold text-gray-900 dark:text-white">{p.views}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SubmissionsTable({ stats }: { stats: AdminStats }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
      <h2 className="font-semibold text-gray-900 dark:text-white">Recent Contact Submissions</h2>
      {stats.submissions.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No submissions yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Contact</th>
                <th className="py-3 pr-4">Service</th>
                <th className="py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {stats.submissions.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-800/60 align-top">
                  <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs text-gray-500 dark:text-gray-400">
                    {new Date(s.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">{s.name}</td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                    <a href={`mailto:${s.email}`} className="text-primary dark:text-primary-light hover:underline">{s.email}</a>
                    {s.phone && <div className="text-xs text-gray-500 dark:text-gray-400">{s.phone}</div>}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {serviceLabels[s.service] ?? s.service ?? "—"}
                  </td>
                  <td className="py-3 max-w-md text-gray-600 dark:text-gray-400">{s.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OverviewSection({ stats, onSeeAll }: { stats: AdminStats; onSeeAll: () => void }) {
  return (
    <div className="space-y-8">
      <StatTiles stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyViewsCard stats={stats} />
        <TopPagesCard stats={stats} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">Latest Enquiries</h2>
          <button
            onClick={onSeeAll}
            className="text-sm font-semibold text-primary dark:text-primary-light hover:underline"
          >
            View all →
          </button>
        </div>
        <SubmissionsTable stats={{ ...stats, submissions: stats.submissions.slice(0, 5) }} />
      </div>
    </div>
  );
}

function AnalyticsSection({ stats }: { stats: AdminStats }) {
  return (
    <div className="space-y-8">
      <StatTiles stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DailyViewsCard stats={stats} />
        <TopPagesCard stats={stats} />
      </div>
    </div>
  );
}

function SubmissionsSection({ stats }: { stats: AdminStats }) {
  return <SubmissionsTable stats={stats} />;
}
