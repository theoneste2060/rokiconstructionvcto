import { Link, createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";
import { useContent } from "~/hooks/useContent";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — ROKI Construction Rwanda" },
      { name: "description", content: "Open positions at ROKI Construction Rwanda: engineering, design, commercial, and site roles in Kigali and across Rwanda." },
    ],
  }),
  component: Careers,
});


function Careers() {
  const { careers } = useContent();
  const { openings, benefits, applyEmail } = careers;
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Careers</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white font-display">
              Build Your Career With Us
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {careers.intro}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Why ROKI */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
                Why Work at ROKI?
              </h2>
            </ScrollReveal>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <ScrollReveal key={b.title} delay={i * 100}>
                <div className="p-6 rounded-2xl bg-card-gradient dark:bg-dark-card border border-gray-200 dark:border-gray-800 h-full">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary-light">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">{b.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{b.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-20 bg-gray-50 dark:bg-secondary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Open Positions</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
                Current Openings
              </h2>
            </ScrollReveal>
          </div>

          <div className="mt-12 space-y-6">
            {openings.map((job, i) => (
              <ScrollReveal key={job.title} delay={i * 100}>
                <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 hover:border-primary/40 transition-colors duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1 font-semibold text-primary bg-primary/10 rounded-full">{job.department}</span>
                        <span className="px-3 py-1 font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full">{job.type}</span>
                        <span className="px-3 py-1 font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full">{job.location}</span>
                      </div>
                    </div>
                    <a
                      href={`mailto:${applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                    >
                      Apply Now
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{job.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {job.requirements.map((req) => (
                      <li key={req} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/10 dark:via-dark-card dark:to-accent/10 border border-primary/20 text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Don't see your role?</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                We're always interested in meeting talented engineers, architects, and builders.
                Send your CV to{" "}
                <a href={`mailto:${applyEmail}`} className="text-primary dark:text-primary-light font-semibold hover:underline">
                  {applyEmail}
                </a>{" "}
                and tell us what you'd bring to the team.
              </p>
              <Link
                to="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
              >
                Learn more about our team
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
