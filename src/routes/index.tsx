import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";
import { ServiceIcon } from "~/components/ServiceIcon";
import { useContent } from "~/hooks/useContent";

export const Route = createFileRoute("/")({
  component: Home,
});




function Home() {
  const { hero, services, projects: allProjects, testimonials } = useContent();
  const projects = allProjects.filter((p) => p.featured);
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-dvh flex items-center overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        {/* Hero background photo — image, brightness, and overlay are managed from /admin */}
        <div className="absolute inset-0">
          <img
            src={hero.image || "/images/hero-bg.jpg"}
            alt="ROKI Construction site in Rwanda at sunrise, with a crane over a building under construction"
            className="w-full h-full object-cover"
            style={{ filter: `brightness(${hero.brightness ?? 100}%)` }}
          />
          {/* Readability overlay — strong on the left where the copy sits */}
          <div className="absolute inset-0" style={{ opacity: (hero.overlay ?? 100) / 100 }}>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/30 dark:from-dark-bg dark:via-dark-bg/85 dark:to-dark-bg/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-dark-bg/70" />
          </div>
        </div>

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
                {hero.badge}
              </span>
            </ScrollReveal>

            <div className="mt-8">
              <ScrollReveal delay={100}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <span className="font-display">{hero.titleLine1}</span>
                  <br />
                  <span className="text-primary">{hero.titleLine2}</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                  {hero.subtitle}
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
                >
                  {hero.ctaPrimary}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-white/10 border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  {hero.ctaSecondary}
                </Link>
              </div>
            </ScrollReveal>

            {/* Stats bar */}
            <ScrollReveal delay={400}>
              <div className="mt-16 flex flex-wrap gap-10 sm:gap-16">
                {hero.stats.map((stat) => (
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
                    <ServiceIcon id={service.icon ?? service.id} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {service.short}
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
                <Link to="/projects/$slug" params={{ slug: project.slug }} className="group block cursor-pointer">
                  <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    {/* Project photo */}
                    <img
                      src={project.image}
                      alt={`${project.title} — ${project.category} project by ROKI Construction`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
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
                </Link>
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