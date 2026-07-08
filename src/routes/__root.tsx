import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "~/styles/app.css?url";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { trackPageView } from "~/server/functions";

/** Record a page view (fire-and-forget) on every client-side navigation. */
function usePageTracking() {
  const pathname = useLocation({ select: (l) => l.pathname });
  useEffect(() => {
    if (pathname.startsWith("/admin")) return; // don't count our own dashboard
    trackPageView({
      data: {
        path: pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      },
    }).catch(() => {
      // analytics must never disturb the visitor
    });
  }, [pathname]);
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ROKI Construction Rwanda — Building Rwanda's Future" },
      { name: "description", content: "ROKI Construction Rwanda delivers high-quality architectural design, geotechnical engineering, sustainability consulting, and project management services across Rwanda." },
      { property: "og:title", content: "ROKI Construction Rwanda — Building Rwanda's Future" },
      { property: "og:description", content: "Architectural design, geotechnical engineering, sustainability consulting, and project management across Rwanda." },
      { property: "og:image", content: "/images/hero-bg.jpg" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/images/roki-logo.png" },
      { rel: "apple-touch-icon", href: "/images/roki-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&display=swap", rel: "stylesheet" },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center bg-white dark:bg-dark-bg">
      <span className="text-6xl font-bold text-primary">404</span>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist.</p>
      <a href="/" className="mt-4 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors">Go Home</a>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  usePageTracking();
  const pathname = useLocation({ select: (l) => l.pathname });
  return (
    <RootDocument siteChrome={!pathname.startsWith("/admin")}>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({
  children,
  siteChrome,
}: {
  children: ReactNode;
  /** False for self-contained layouts like /admin that bring their own chrome. */
  siteChrome: boolean;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh">
        <ThemeProvider>
          {siteChrome ? (
            <div className="flex min-h-dvh flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          ) : (
            <main className="min-h-dvh">{children}</main>
          )}
          {/* Scroll reveal observer script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  // Restore theme on load (blocking to prevent flash)
                  const t = localStorage.getItem('roki-theme');
                  if (t === 'light') document.documentElement.classList.remove('dark');
                  else document.documentElement.classList.add('dark');
                })();
              `,
            }}
          />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}