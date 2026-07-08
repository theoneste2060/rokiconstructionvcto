import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";
import { getSiteContent } from "~/server/functions";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const { projects } = await getSiteContent();
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    const related = projects
      .filter((p) => p.category === project.category && p.slug !== project.slug)
      .slice(0, 3);
    return { project, related };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — ROKI Construction Rwanda` },
          { name: "description", content: loaderData.project.summary },
        ]
      : [],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project, related } = Route.useLoaderData();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="relative h-[55vh] min-h-[400px]">
          <img
            src={project.image}
            alt={`${project.title} — ${project.category} project by ROKI Construction`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                All Projects
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                  {project.category}
                </span>
                <span className="px-3 py-1 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full">
                  {project.year}
                </span>
                <span className="text-sm text-white/80">{project.location}</span>
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold text-white font-display">
                {project.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-card-gradient dark:bg-dark-card border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2 space-y-6">
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-display">
                  About This Project
                </h2>
              </ScrollReveal>
              {project.description.map((para, i) => (
                <ScrollReveal key={i} delay={100 + i * 50}>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{para}</p>
                </ScrollReveal>
              ))}
            </div>

            {/* Scope */}
            <ScrollReveal delay={150}>
              <div className="p-8 rounded-2xl bg-gray-50 dark:bg-secondary border border-gray-200 dark:border-gray-800 h-fit">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scope of Work</h3>
                <ul className="mt-5 space-y-3">
                  {project.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                >
                  Start a Similar Project
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-secondary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-display">
                More {project.category} Projects
              </h2>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ScrollReveal key={p.slug} delay={i * 100}>
                  <Link to="/projects/$slug" params={{ slug: p.slug }} className="group block">
                    <div className="relative h-56 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                      <img
                        src={p.image}
                        alt={`${p.title} — ${p.category} project by ROKI Construction`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-xs font-semibold text-primary-light uppercase tracking-wider">{p.year}</span>
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
