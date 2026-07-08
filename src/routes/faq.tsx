import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScrollReveal } from "~/components/ScrollReveal";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [{ title: "FAQ — ROKI Construction Rwanda" }],
  }),
  component: Faq,
});

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I request a quote for my project?",
        a: "Use the contact form on our website, call us, or email info@rokiconstruction.rw with a short description of your project. We'll arrange a free consultation — usually within 48 hours — to understand your needs before preparing a detailed, itemised quotation.",
      },
      {
        q: "Do you handle small projects, or only large developments?",
        a: "Both. We build everything from single-family homes and renovations to commercial towers and infrastructure. Every project gets the same professional process: proper drawings, itemised costing, and dedicated site supervision.",
      },
      {
        q: "Which areas of Rwanda do you work in?",
        a: "We're headquartered in Kigali and work across all of Rwanda — recent projects span Kigali, Musanze, Rubavu, Huye, and Nyungwe. For projects outside Kigali we establish a full site presence with local hiring wherever possible.",
      },
    ],
  },
  {
    category: "Costs & Contracts",
    items: [
      {
        q: "How much does it cost to build in Rwanda?",
        a: "It depends on design complexity, site conditions, and finishes — which is why we always start with a free consultation and provide an itemised bill of quantities rather than a vague lump sum. That way you see exactly where every franc goes and can adjust scope to fit your budget.",
      },
      {
        q: "How are payments structured?",
        a: "Payments are tied to verified construction milestones — foundations complete, ring beam cast, roof on, and so forth — never to calendar dates. Your money always follows completed, inspected work.",
      },
      {
        q: "What happens if I want to change something mid-project?",
        a: "Changes happen on almost every project, so we agree a written variations procedure before construction starts. Any change is priced and approved by you in writing before the work proceeds — no surprise costs at handover.",
      },
    ],
  },
  {
    category: "During Construction",
    items: [
      {
        q: "How do you keep projects on schedule?",
        a: "Every project has a milestone programme, a dedicated project manager, and weekly progress reports with photos. We sequence trades carefully, pre-order long-lead materials, and flag risks early — that discipline is why our on-time delivery record stands at 100%.",
      },
      {
        q: "Who supervises the site day-to-day?",
        a: "A qualified ROKI site engineer is present on every active site, supported by our head office engineering team. You'll know your supervisor by name and have their direct contact from day one.",
      },
      {
        q: "What safety standards do you follow?",
        a: "All sites operate under our health & safety management system: inductions for every worker, daily toolbox talks, mandatory protective equipment, and regular independent inspections. Our goal on every project is simple — zero incidents.",
      },
    ],
  },
  {
    category: "After Handover",
    items: [
      {
        q: "Is there a warranty on your work?",
        a: "Yes. Every contract includes a defects liability period after handover during which we repair any defect in workmanship at no cost. Structural elements carry longer guarantees, detailed in your contract.",
      },
      {
        q: "Do you offer maintenance services after completion?",
        a: "We do. Many clients keep us on for planned maintenance — from annual inspections to full facilities support — so their building keeps performing the way it did on handover day.",
      },
    ],
  },
];

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
