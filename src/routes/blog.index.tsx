import { Link, createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";
import { formatPostDate } from "~/data/posts";
import { useContent } from "~/hooks/useContent";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Insights — ROKI Construction Rwanda" },
      { name: "description", content: "Practical guidance on construction, engineering, and sustainable building in Rwanda from the ROKI Construction team." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const { posts } = useContent();
  const [lead, ...rest] = posts;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Insights</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white font-display">
              Building Knowledge
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Practical guidance on construction, engineering, and sustainable building
              in Rwanda — straight from our team.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Posts */}
      <section className="py-24 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Lead article */}
          <ScrollReveal>
            <Link
              to="/blog/$slug"
              params={{ slug: lead.slug }}
              className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-card-gradient dark:bg-dark-card hover:border-primary/40 transition-colors duration-300"
            >
              <div className="relative h-72 lg:h-full min-h-72 overflow-hidden">
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 font-semibold text-primary bg-primary/10 rounded-full">{lead.category}</span>
                  <span className="text-gray-500 dark:text-gray-400">{formatPostDate(lead.date)}</span>
                  <span className="text-gray-500 dark:text-gray-400">· {lead.readMinutes} min read</span>
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white font-display group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {lead.title}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{lead.excerpt}</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={lead.author.photo} alt={lead.author.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{lead.author.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{lead.author.role}</div>
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Grid of remaining posts */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 100}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-card-gradient dark:bg-dark-card hover:border-primary/40 transition-colors duration-300"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-3 py-1 font-semibold text-primary bg-primary/10 rounded-full">{post.category}</span>
                      <span className="text-gray-500 dark:text-gray-400">{post.readMinutes} min read</span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
                    <div className="mt-auto pt-5 flex items-center gap-3">
                      <img src={post.author.photo} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="text-xs">
                        <div className="font-semibold text-gray-900 dark:text-white">{post.author.name}</div>
                        <div className="text-gray-500 dark:text-gray-400">{formatPostDate(post.date)}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
