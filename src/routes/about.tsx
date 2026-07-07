import { createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "~/components/ScrollReveal";

export const Route = createFileRoute("/about")({
  component: About,
});

const values = [
  {
    title: "Excellence",
    description: "We pursue the highest standards in every project, from design to delivery.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    title: "Integrity",
    description: "Honest communication, transparent processes, and ethical business practices.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Innovation",
    description: "Embracing modern techniques, sustainable materials, and creative problem-solving.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "Community",
    description: "Building a better Rwanda by investing in local talent and sustainable development.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const team = [
  { name: "Patrick Rukundo", role: "CEO & Founder", bio: "15+ years in construction and development across East Africa." },
  { name: "Grace Mukamana", role: "Chief Architect", bio: "Award-winning architect specializing in sustainable design." },
  { name: "Emmanuel Habimana", role: "Head of Engineering", bio: "Expert geotechnical engineer with a passion for innovation." },
  { name: "Diane Uwimana", role: "Project Director", bio: "Certified PMP with a track record of on-time delivery." },
];

function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-hero-pattern-light dark:bg-hero-pattern">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About Us</span>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white font-display">
              Building Rwanda's Future
              <br />
              <span className="text-primary">One Structure at a Time</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Since 2021, ROKI Construction has been at the forefront of Rwanda's construction 
              industry — combining international standards with local expertise to deliver 
              exceptional results.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 dark:from-primary/10 dark:via-accent/5 dark:to-secondary/30 border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-40 h-40 text-primary/20 dark:text-primary/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-primary">50+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Projects completed across Rwanda</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
                  Our Story
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  ROKI Construction was founded in Kigali with a simple mission: to transform 
                  Rwanda's built environment through quality craftsmanship, innovative design, 
                  and unwavering integrity.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  What started as a small team of passionate builders has grown into a full-service 
                  construction company with expertise spanning architectural design, geotechnical 
                  engineering, sustainability consulting, and project management.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={250}>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Every project we undertake is a promise — to our clients, to our community, and 
                  to Rwanda. We build not just structures, but lasting relationships and a 
                  sustainable future.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 dark:bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Values</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
                What Drives Us
              </h2>
            </ScrollReveal>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-primary-light">
                    {v.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{v.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white dark:bg-dark-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our Team</span>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
                Meet the Leadership
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experienced professionals dedicated to building a better Rwanda.
              </p>
            </ScrollReveal>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 100}>
                <div className="group text-center">
                  <div className="w-40 h-40 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/30 dark:from-primary/10 dark:via-accent/5 dark:to-secondary/20 border border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden">
                    <div className="text-5xl font-bold text-primary/30 dark:text-primary/20 font-display">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{member.bio}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/5 dark:via-dark-bg dark:to-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-display">
              Want to Work With Us?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              We're always looking for talented individuals and exciting new projects.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 active:scale-95"
              >
                Get in Touch
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}