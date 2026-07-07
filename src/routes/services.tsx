import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";

export const Route = createFileRoute("/services")({
  component: Services,
});

const serviceDetails = [
  {
    id: "architectural",
    title: "Architectural Design",
    tagline: "Innovative designs that inspire and endure",
    description: "Our architectural team blends modern aesthetics with Rwandan cultural heritage to create buildings that are both beautiful and functional. From residential homes to commercial complexes, every design tells a story.",
    highlights: [
      "Residential & commercial architecture",
      "Interior design & space planning",
      "3D visualization & rendering",
      "Building regulations compliance",
      "Heritage-sensitive design",
    ],
    gradient: "from-emerald-500/20 to-green-500/10",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
  },
  {
    id: "geotechnical",
    title: "Geotechnical Engineering",
    tagline: "Foundations you can trust",
    description: "We provide comprehensive geotechnical investigations and foundation solutions. Our expert engineers assess soil conditions to ensure every structure is built on solid ground, safe and secure for generations.",
    highlights: [
      "Soil investigation & analysis",
      "Foundation design & consulting",
      "Slope stability assessment",
      "Material testing & quality control",
      "Seismic risk evaluation",
    ],
    gradient: "from-stone-500/20 to-amber-600/10",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    id: "sustainability",
    title: "Sustainability Consulting",
    tagline: "Building green for a better tomorrow",
    description: "Our sustainability consultants help clients reduce environmental impact while lowering operational costs. We integrate eco-friendly practices into every phase of construction, from material selection to energy systems.",
    highlights: [
      "Green building certification (EDGE, LEED)",
      "Energy efficiency audits",
      "Sustainable material sourcing",
      "Water conservation systems",
      "Carbon footprint reduction",
    ],
    gradient: "from-emerald-500/20 to-teal-500/10",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    id: "landscaping",
    title: "Landscaping & Site Development",
    tagline: "Beautiful outdoor environments",
    description: "We transform outdoor spaces into functional, beautiful environments. From site preparation and grading to complete landscape architecture, we create outdoor areas that complement and enhance your property.",
    highlights: [
      "Site clearing & preparation",
      "Landscape architecture & design",
      "Hardscaping (patios, walkways)",
      "Irrigation & drainage systems",
      "Outdoor recreation areas",
    ],
    gradient: "from-green-500/20 to-emerald-500/10",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: "management",
    title: "Project Management",
    tagline: "On time, on budget, every time",
    description: "Our certified project managers oversee every aspect of construction from concept to completion. We coordinate contractors, manage budgets, track timelines, and ensure quality control — giving you peace of mind.",
    highlights: [
      "Full project lifecycle management",
      "Budget & cost control",
      "Timeline & milestone tracking",
      "Contractor coordination",
      "Quality assurance & inspection",
    ],
    gradient: "from-stone-500/20 to-amber-700/10",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
];

function Services() {
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
                <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${service.gradient} border border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden relative`}>
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full p-8" viewBox="0 0 400 300">
                      <rect x="60" y="60" width="280" height="180" rx="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                      <rect x="120" y="40" width="40" height="60" fill="currentColor" opacity="0.2" />
                      <rect x="240" y="40" width="40" height="60" fill="currentColor" opacity="0.2" />
                      <rect x="100" y="140" width="80" height="100" fill="currentColor" opacity="0.15" />
                      <rect x="220" y="120" width="80" height="120" fill="currentColor" opacity="0.15" />
                    </svg>
                  </div>
                  <div className="relative p-12 text-center">
                    <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-white/80 dark:bg-dark-card/80 text-primary">
                      {service.icon}
                    </div>
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