import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";
import { ServiceIcon } from "~/components/ServiceIcon";
import { useContent } from "~/hooks/useContent";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ROKI Construction Rwanda" },
      { name: "description", content: "Architectural design, geotechnical engineering, sustainability consulting, landscaping, and project management services across Rwanda." },
    ],
  }),
  component: Services,
});


function Services() {
  const { services: serviceDetails } = useContent();
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Services</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white font-display">
              What We Offer
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              End-to-end construction services delivered with precision, passion, and 
              Rwandan pride.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Service details */}
      {serviceDetails.map((service, i) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-24 ${i % 2 === 0 ? "bg-white dark:bg-dark-bg" : "bg-gray-50 dark:bg-secondary"}`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
              <ScrollReveal className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="group aspect-[4/3] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden relative">
                  {/* Service photo */}
                  <img
                    src={service.image}
                    alt={`${service.title} — ROKI Construction`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Floating service icon badge */}
                  <div className="absolute bottom-5 left-5 w-14 h-14 flex items-center justify-center rounded-2xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm text-primary dark:text-primary-light shadow-lg">
                    <ServiceIcon id={service.id} className="w-8 h-8" />
                  </div>
                </div>
              </ScrollReveal>
              <div>
                <ScrollReveal delay={100}>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
                    {service.title}
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={150}>
                  <p className="mt-3 text-lg text-primary font-medium">{service.tagline}</p>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{service.description}</p>
                </ScrollReveal>
                <ScrollReveal delay={250}>
                  <ul className="mt-6 space-y-3">
                    {service.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <div className="mt-8">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                    >
                      Inquire About This Service
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/5 dark:via-dark-bg dark:to-accent/5 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
              Not Sure Which Service You Need?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Tell us about your project and we'll recommend the best approach.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
              >
                Let's Talk
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