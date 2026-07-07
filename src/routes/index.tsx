import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";

export const Route = createFileRoute("/")({
  component: Home,
});

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
    title: "Architectural Design",
    description: "Innovative, sustainable designs that blend modern aesthetics with Rwandan cultural heritage.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    title: "Geotechnical Engineering",
    description: "Comprehensive soil analysis and foundation solutions for safe, durable structures.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: "Sustainability Consulting",
    description: "Eco-friendly building solutions that reduce environmental impact and operational costs.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Landscaping & Site Dev",
    description: "Beautiful outdoor spaces and comprehensive site preparation for any development.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    title: "Project Management",
    description: "End-to-end project oversight ensuring on-time, on-budget, quality delivery.",
  },
];

const projects = [
  { title: "Kigali Heights Tower", category: "Commercial", gradient: "from-emerald-800/40 to-teal-600/20" },
  { title: "Green Hills Estate", category: "Residential", gradient: "from-green-800/40 to-emerald-600/20" },
  { title: "Rwanda Innovation Hub", category: "Institutional", gradient: "from-teal-800/40 to-cyan-600/20" },
  { title: "Lake View Resort", category: "Hospitality", gradient: "from-amber-800/40 to-yellow-600/20" },
  { title: "Kacyiru Business Center", category: "Commercial", gradient: "from-stone-800/40 to-amber-600/20" },
  { title: "Mountainside Villas", category: "Residential", gradient: "from-emerald-900/40 to-green-600/20" },
];

const testimonials = [
  {
    quote: "ROKI Construction delivered our commercial complex ahead of schedule and under budget. Their attention to detail and project management was exceptional.",
    author: "Jean-Pierre Mugabo",
    role: "CEO, Kigali Properties Ltd",
  },
  {
    quote: "The sustainability consulting team helped us achieve a 40% reduction in energy costs. Their expertise in green building is unmatched in Rwanda.",
    author: "Alice Uwimana",
    role: "Director, Green Rwanda Initiative",
  },
  {
    quote: "From foundation to finishing, ROKI's team showed professionalism and craftsmanship. Our home is exactly what we dreamed of.",
    author: "David Niyonzima",
    role: "Homeowner, Kicukiro",
  },
];

function Home() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-dvh flex items-center overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-20" />
        <div className="absolute top-20 right-20 w-72 h-72 border border-primary/10 rounded-full animate-float" />
        <div className="absolute bottom-20 left-20 w-48 h-48 border border-accent/10 rounded-full animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary/40 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-accent/30 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-primary/50 rounded-full" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 w-full">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/10 rounded-full border border-primary/20">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                Established 2021
              </span>
            </ScrollReveal>

            <div className="mt-8">
              <ScrollReveal delay={100}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <span className="font-display">Building</span>
                  <br />
                  <span className="text-primary">Rwanda's Future</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                  ROKI Construction delivers world-class architectural design, engineering, 
                  and project management — right here in the heart of Rwanda.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
                >
                  Start Your Project
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  View Our Work
                </Link>
              </div>
            </ScrollReveal>

            {/* Stats bar */}
            <ScrollReveal delay={400}>
              <div className="mt-16 flex flex-wrap gap-10 sm:gap-16">
                {[
                  { value: "50+", label: "Projects Delivered" },
                  { value: "5+", label: "Years Experience" },
                  { value: "100%", label: "On-Time Delivery" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-dark-bg to-transparent" />
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="relative py-24 sm:py-32 bg-white dark:bg-dark-bg">
        {/* Section header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What We Do</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-display">
              Comprehensive Construction Services
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From concept to completion, we offer everything you need under one roof.
            </p>
          </ScrollReveal>
        </div>

        {/* Service cards */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 100}>
                <div className="group relative p-6 rounded-2xl bg-card-gradient dark:bg-dark-card border border-gray-200 dark:border-gray-800 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary-light group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-semibold transition-colors"
            >
              Explore All Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section className="relative py-24 sm:py-32 bg-gray-50 dark:bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Portfolio</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-display">
                Featured Projects
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Each project reflects our commitment to quality, innovation, and excellence.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ScrollReveal key={project.title} delay={i * 100}>
                <div className="group cursor-pointer">
                  <div className={`relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-br ${project.gradient} border border-gray-200 dark:border-gray-800`}>
                    {/* Abstract building pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <svg className="w-full h-full" viewBox="0 0 400 400">
                        <rect x="80" y="120" width="40" height="80" fill="white" opacity="0.3" />
                        <rect x="140" y="80" width="40" height="120" fill="white" opacity="0.2" />
                        <rect x="200" y="140" width="40" height="60" fill="white" opacity="0.3" />
                        <rect x="260" y="100" width="40" height="100" fill="white" opacity="0.2" />
                        <line x1="40" y1="280" x2="360" y2="280" stroke="white" strokeWidth="2" opacity="0.3" />
                      </svg>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">{project.category}</span>
                        <h3 className="mt-1 text-lg font-bold text-white">{project.title}</h3>
                      </div>
                    </div>
                    {/* Category badge - always visible */}
                    <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full">
                      {project.category}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500}>
            <div className="mt-12 text-center">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
              >
                View All Projects
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-24 sm:py-32 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Testimonials</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-display">
                What Our Clients Say
              </h2>
            </ScrollReveal>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.author} delay={i * 150}>
                <div className="relative p-8 rounded-2xl bg-card-gradient dark:bg-dark-card border border-gray-200 dark:border-gray-800">
                  {/* Quote icon */}
                  <svg className="w-10 h-10 text-primary/20 dark:text-primary/10 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.144 11 15c0 1.93-1.557 3.5-3.5 3.5-1.175 0-2.232-.552-2.917-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.144 21 15c0 1.93-1.557 3.5-3.5 3.5-1.175 0-2.232-.552-2.917-1.179z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.author}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/5 dark:via-dark-bg dark:to-accent/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-display">
              Ready to Build Something Great?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Let's discuss your project. Our team is ready to turn your vision into reality.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
              >
                Get in Touch
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Our Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}