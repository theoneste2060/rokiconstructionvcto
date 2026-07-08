import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScrollReveal } from "~/components/ScrollReveal";

export const Route = createFileRoute("/projects")({
  component: Projects,
});

const allProjects = [
  { title: "Kigali Heights Tower", category: "Commercial", size: "large", image: "/images/kigali_commercial_office.webp", year: "2025" },
  { title: "Green Hills Estate", category: "Residential", size: "large", image: "/images/kigali_residential_complex.webp", year: "2024" },
  { title: "Rwanda Innovation Hub", category: "Institutional", size: "medium", image: "/images/rwandan_rural_school.webp", year: "2025" },
  { title: "Lake View Resort", category: "Hospitality", size: "large", image: "/images/kigali_luxury_villa.webp", year: "2024" },
  { title: "Kacyiru Business Center", category: "Commercial", size: "medium", image: "/images/kigali_construction_site.webp", year: "2023" },
  { title: "Mountainside Villas", category: "Residential", size: "medium", image: "/images/sustainable_rooftop_kigali.webp", year: "2024" },
  { title: "Musanze Ridge Bridge", category: "Infrastructure", size: "large", image: "/images/rwandan_road_bridge.webp", year: "2024" },
  { title: "Nyarutarama Office Park", category: "Commercial", size: "medium", image: "/images/rwandan_warehouse.webp", year: "2023" },
  { title: "Rwanda Eco-Lodge", category: "Hospitality", size: "large", image: "/images/landscaping_crew_rwanda.webp", year: "2025" },
  { title: "Gacuriro Housing Development", category: "Residential", size: "small", image: "/images/kigali_luxury_villa.webp", year: "2023" },
];

const categories = ["All", "Commercial", "Residential", "Hospitality", "Institutional", "Infrastructure"];

function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Portfolio</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white font-display">
              Our Projects
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              From commercial towers to residential communities — each project reflects 
              our commitment to quality and innovation.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-10 inline-flex flex-wrap justify-center gap-2 p-1.5 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeFilter === cat
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Project grid */}
      <section className="py-24 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <ScrollReveal key={project.title} delay={i * 80}>
                <div className={`group cursor-pointer ${project.size === "large" ? "sm:col-span-2 sm:row-span-1" : ""}`}>
                  <div className={`relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 ${
                    project.size === "large" ? "h-80" : "h-64"
                  }`}>
                    {/* Project photo */}
                    <img
                      src={project.image}
                      alt={`${project.title} — ${project.category} project by ROKI Construction`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Bottom scrim so the always-visible title stays readable */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6">
                      <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">{project.category}</span>
                      <h3 className="mt-1 text-xl font-bold text-white">{project.title}</h3>
                      <p className="text-sm text-gray-300 mt-1">Completed {project.year}</p>
                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary-light opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span>View Project</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full">
                        {project.category}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold text-white bg-black/40 backdrop-blur-sm rounded-full">
                        {project.year}
                      </span>
                    </div>

                    {/* Title always visible */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-bold text-white drop-shadow-lg">{project.title}</h3>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              No projects found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24 bg-gray-50 dark:bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50+", label: "Projects Completed" },
              { value: "5+", label: "Years of Experience" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "10+", label: "Industry Awards" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100}>
                <div className="text-center p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/5 dark:via-dark-bg dark:to-accent/5 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
              Start Your Project
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Let's build something remarkable together.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
              >
                Get in Touch
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