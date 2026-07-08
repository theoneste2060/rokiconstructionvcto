import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";
import { formatPostDate, getPost, posts } from "~/data/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.post.title} — ROKI Construction Rwanda` }] : [],
  }),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="relative h-[45vh] min-h-[360px]">
          <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                All Insights
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <span className="px-3 py-1 font-semibold text-white bg-primary rounded-full">{post.category}</span>
                <span className="text-white/80">{formatPostDate(post.date)}</span>
                <span className="text-white/80">· {post.readMinutes} min read</span>
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white font-display leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Author */}
          <ScrollReveal>
            <div className="flex items-center gap-4 pb-8 border-b border-gray-200 dark:border-gray-800">
              <img src={post.author.photo} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{post.author.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{post.author.role}, ROKI Construction</div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-8 space-y-6">
            {post.body.map((para, i) => (
              <ScrollReveal key={i} delay={Math.min(i * 40, 200)}>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{para}</p>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA */}
          <ScrollReveal>
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/10 dark:via-dark-card dark:to-accent/10 border border-primary/20 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                Planning a project of your own?
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Our team is happy to talk through your site, budget, and options — no obligation.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* More posts */}
      <section className="py-16 bg-gray-50 dark:bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Keep Reading</h2>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {more.map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 100}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex gap-5 p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 hover:border-primary/40 transition-colors duration-300"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-28 h-28 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-primary">{p.category}</span>
                    <h3 className="mt-1 font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {formatPostDate(p.date)} · {p.readMinutes} min read
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
