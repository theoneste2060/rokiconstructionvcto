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
import { getSiteContent, trackPageView } from "~/server/functions";
import { defaultContent } from "~/data/content";

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
  loader: () => getSiteContent(),
  head: ({ loaderData }) => {
    const s = loaderData?.settings ?? defaultContent.settings;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: s.seoTitle },
        { name: "description", content: s.seoDescription },
        { name: "theme-color", content: "#204830" },
        { property: "og:site_name", content: s.businessName },
        { property: "og:title", content: s.seoTitle },
        { property: "og:description", content: s.seoDescription },
        { property: "og:image", content: `${s.siteUrl}/images/hero-bg.jpg` },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_RW" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: s.seoTitle },
        { name: "twitter:description", content: s.seoDescription },
        { name: "twitter:image", content: `${s.siteUrl}/images/hero-bg.jpg` },
        { name: "geo.region", content: "RW" },
        { name: "geo.placename", content: "Kigali" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", href: "/images/roki-logo.png" },
        { rel: "apple-touch-icon", href: "/images/roki-logo.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800&display=swap", rel: "stylesheet" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GeneralContractor",
            name: s.businessName,
            description: s.seoDescription,
            url: s.siteUrl || undefined,
            logo: `${s.siteUrl}/images/roki-logo.png`,
            image: `${s.siteUrl}/images/hero-bg.jpg`,
            email: s.email,
            telephone: s.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: s.addressLines[0] ?? "",
              addressLocality: "Kigali",
              addressCountry: "RW",
            },
            geo: { "@type": "GeoCoordinates", latitude: -1.9441, longitude: 30.0619 },
            areaServed: "Rwanda",
            foundingDate: "2021",
          }),
        },
      ],
    };
  },
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
        {/* Theme restore runs before content is parsed so there is no flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const t = localStorage.getItem('roki-theme');
                const dark = (t === 'dark' || t === 'light')
                  ? t === 'dark'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', dark);
              })();
            `,
          }}
        />
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
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}