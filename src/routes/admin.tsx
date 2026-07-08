import { createFileRoute } from "@tanstack/react-router";
import { getAdminStats } from "~/server/functions";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminStats(),
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

function Admin() {
  const stats = Route.useLoaderData();
  const maxDay = Math.max(1, ...stats.viewsByDay.map((d) => d.views));
  const maxPage = Math.max(1, ...stats.topPages.map((p) => p.views));

  return (
    <div className="pt-24 pb-20 min-h-dvh bg-gray-50 dark:bg-dark-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
          Site Dashboard
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Visitor activity and contact form submissions.
        </p>

        {!stats.configured && (
          <div className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300">
            <h2 className="font-semibold">Database not connected yet</h2>
            <p className="mt-1 text-sm leading-relaxed">
              Analytics and contact submissions need a database. Connect one (Neon Postgres via the
              database card, which provides <code className="font-mono text-xs">DATABASE_URL</code>) and
              this dashboard will start filling in automatically — no code changes required.
            </p>
          </div>
        )}

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
          This dashboard is unlisted (and marked noindex) but not password-protected — ask us to add
          authentication before sharing the URL beyond the team.
        </p>
      </div>
    </div>
  );
}
