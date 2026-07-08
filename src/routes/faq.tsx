import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScrollReveal } from "~/components/ScrollReveal";
import { getSiteContent } from "~/server/functions";
import type { FaqItem as FaqEntry } from "~/data/content";

export const Route = createFileRoute("/faq")({
  loader: async () => {
    const { faqs } = await getSiteContent();
    return { faqs };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "FAQ — ROKI Construction Rwanda" },
      { name: "description", content: "Answers to the questions clients across Rwanda ask us most: quotes, costs, payments, schedules, safety, and warranties." },
    ],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: loaderData.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          },
        ]
      : [],
  }),
  component: Faq,
});

/** Group the flat FAQ list into ordered categories. */
function groupFaqs(faqs: FaqEntry[]) {
  const groups: { category: string; items: FaqEntry[] }[] = [];
  for (const f of faqs) {
    const g = groups.find((x) => x.category === f.category);
    if (g) g.items.push(f);
    else groups.push({ category: f.category, items: [f] });
  }
  return groups;
}


function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white">{q}</span>
        <svg
          className={`w-5 h-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const { faqs: flatFaqs } = Route.useLoaderData();
  const faqs = groupFaqs(flatFaqs);
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">FAQ</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white font-display">
              Frequently Asked Questions
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Straight answers to the questions we hear most from clients across Rwanda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="py-20 bg-gray-50 dark:bg-secondary">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-12">
          {faqs.map((group, gi) => (
            <div key={group.category}>
              <ScrollReveal delay={gi * 50}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white font-display">
                  {group.category}
                </h2>
              </ScrollReveal>
              <div className="mt-6 space-y-4">
                {group.items.map((item, i) => (
                  <ScrollReveal key={item.q} delay={gi * 50 + i * 60}>
                    <FaqItem q={item.q} a={item.a} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-dark-bg text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
              Still Have Questions?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Our team is happy to help — reach out and we'll respond within 24 hours.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
              >
                Contact Us
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
