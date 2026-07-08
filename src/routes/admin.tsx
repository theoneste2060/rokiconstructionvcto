import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "~/server/functions";

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

const STORAGE_KEY = "roki-admin-key";

function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);

  const authenticate = async (candidate: string, opts: { silent: boolean }) => {
    setChecking(true);
    setError(false);
    try {
      const result = await getAdminStats({ data: { password: candidate } });
      if (result.authorized) {
        sessionStorage.setItem(STORAGE_KEY, candidate);
        setStats(result);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        if (!opts.silent) setError(true);
      }
    } catch {
      if (!opts.silent) setError(true);
    } finally {
      setChecking(false);
    }
  };

  // Re-use a password remembered earlier in this browser session.
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      void authenticate(saved, { silent: true });
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || checking) return;
    void authenticate(password, { silent: false });
  };

  if (!stats?.authorized) {
    return (
      <div className="pt-24 pb-20 min-h-dvh flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="w-full max-w-sm mx-auto px-4">
          <form
            onSubmit={handleLogin}
            className="p-8 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary-light">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="mt-4 text-xl font-bold text-center text-gray-900 dark:text-white font-display">
              Site Dashboard
            </h1>
            <p className="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">
              Enter the admin password to continue.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="mt-6 w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            />
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                Incorrect password. Please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={checking || !password}
              className="mt-5 w-full px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checking ? "Checking…" : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const maxDay = Math.max(1, ...stats.viewsByDay.map((d) => d.views));
  const maxPage = Math.max(1, ...stats.topPages.map((p) => p.views));

  return (
    <div className="pt-24 pb-20 min-h-dvh bg-gray-50 dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
              Site Dashboard
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Visitor activity and contact form submissions.
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem(STORAGE_KEY);
              setStats(null);
              setPassword("");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded-lg hover:border-primary transition-colors"
          >
            Lock
          </button>
        </div>

        {/* Overview tiles */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
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
              <div className="text-3xl font-bold text-primary">{tile.value}</div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tile.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Views by day */}
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

          {/* Top pages */}
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
        </div>

        {/* Submissions */}
        <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
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

        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          Data is stored in the site's local SQLite database (.data/site.db). The dashboard unlocks
          for this browser session only.
        </p>
      </div>
    </div>
  );
}
