import { projects as defaultProjects, type Project } from "./projects";
import { posts as defaultPosts, type Post } from "./posts";

/**
 * Everything on the public site that can be edited from the /admin Content
 * section. Each top-level key is stored as one JSON document in the
 * site_content table; anything not yet saved falls back to these defaults.
 */

export type SiteSettings = {
  businessName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  /** Absolute origin (https://example.com) used for canonical URLs & sitemap. Leave empty until the site has a domain. */
  siteUrl: string;
  footerBlurb: string;
  email: string;
  email2: string;
  phone: string;
  phone2: string;
  addressLines: string[];
  hoursLines: string[];
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
};

export type HeroContent = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  stats: { value: string; label: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
};

export type ServiceContent = {
  id: string;
  title: string;
  tagline: string;
  short: string;
  description: string;
  highlights: string[];
  image: string;
};

export type AboutContent = {
  heroTitle1: string;
  heroTitle2: string;
  heroIntro: string;
  storyParagraphs: string[];
  storyImage: string;
  values: { title: string; description: string }[];
  team: { name: string; role: string; bio: string; photo: string }[];
};

export type Testimonial = { quote: string; author: string; role: string };

export type CareersContent = {
  intro: string;
  benefits: { title: string; description: string }[];
  openings: {
    title: string;
    type: string;
    location: string;
    department: string;
    description: string;
    requirements: string[];
  }[];
  applyEmail: string;
};

export type FaqItem = { category: string; q: string; a: string };

export type SiteContent = {
  settings: SiteSettings;
  hero: HeroContent;
  services: ServiceContent[];
  about: AboutContent;
  testimonials: Testimonial[];
  projects: Project[];
  posts: Post[];
  careers: CareersContent;
  faqs: FaqItem[];
};

export const defaultContent: SiteContent = {
  settings: {
    businessName: "ROKI Construction Rwanda",
    tagline: "Building Rwanda's Future",
    seoTitle: "ROKI Construction Rwanda — Building Rwanda's Future",
    seoDescription:
      "ROKI Construction Rwanda delivers high-quality architectural design, geotechnical engineering, sustainability consulting, and project management services across Rwanda.",
    siteUrl: "",
    footerBlurb:
      "Building Rwanda's future with excellence, integrity, and innovation. Your trusted partner in construction and development since 2021.",
    email: "info@rokiconstruction.rw",
    email2: "projects@rokiconstruction.rw",
    phone: "+250 788 000 000",
    phone2: "+250 733 000 000",
    addressLines: ["KG 123 Street", "Kacyiru, Kigali", "Rwanda"],
    hoursLines: [
      "Monday - Friday: 8:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 1:00 PM",
      "Sunday: Closed",
    ],
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#",
  },

  hero: {
    badge: "Established 2021",
    titleLine1: "Building",
    titleLine2: "Rwanda's Future",
    subtitle:
      "ROKI Construction delivers world-class architectural design, engineering, and project management — right here in the heart of Rwanda.",
    stats: [
      { value: "50+", label: "Projects Delivered" },
      { value: "5+", label: "Years Experience" },
      { value: "100%", label: "On-Time Delivery" },
    ],
    ctaPrimary: "Start Your Project",
    ctaSecondary: "View Our Work",
  },

  services: [
    {
      id: "architectural",
      title: "Architectural Design",
      tagline: "Innovative designs that inspire and endure",
      short: "Innovative, sustainable designs that blend modern aesthetics with Rwandan cultural heritage.",
      description:
        "Our architectural team blends modern aesthetics with Rwandan cultural heritage to create buildings that are both beautiful and functional. From residential homes to commercial complexes, every design tells a story.",
      highlights: [
        "Residential & commercial architecture",
        "Interior design & space planning",
        "3D visualization & rendering",
        "Building regulations compliance",
        "Heritage-sensitive design",
      ],
      image: "/images/architect_sketching.webp",
    },
    {
      id: "geotechnical",
      title: "Geotechnical Engineering",
      tagline: "Foundations you can trust",
      short: "Comprehensive soil analysis and foundation solutions for safe, durable structures.",
      description:
        "We provide comprehensive geotechnical investigations and foundation solutions. Our expert engineers assess soil conditions to ensure every structure is built on solid ground, safe and secure for generations.",
      highlights: [
        "Soil investigation & analysis",
        "Foundation design & consulting",
        "Slope stability assessment",
        "Material testing & quality control",
        "Seismic risk evaluation",
      ],
      image: "/images/geotechnical_investigation_rwanda.webp",
    },
    {
      id: "sustainability",
      title: "Sustainability Consulting",
      tagline: "Building green for a better tomorrow",
      short: "Eco-friendly building solutions that reduce environmental impact and operational costs.",
      description:
        "Our sustainability consultants help clients reduce environmental impact while lowering operational costs. We integrate eco-friendly practices into every phase of construction, from material selection to energy systems.",
      highlights: [
        "Green building certification (EDGE, LEED)",
        "Energy efficiency audits",
        "Sustainable material sourcing",
        "Water conservation systems",
        "Carbon footprint reduction",
      ],
      image: "/images/sustainable_rooftop_kigali.webp",
    },
    {
      id: "landscaping",
      title: "Landscaping & Site Development",
      tagline: "Beautiful outdoor environments",
      short: "Beautiful outdoor spaces and comprehensive site preparation for any development.",
      description:
        "We transform outdoor spaces into functional, beautiful environments. From site preparation and grading to complete landscape architecture, we create outdoor areas that complement and enhance your property.",
      highlights: [
        "Site clearing & preparation",
        "Landscape architecture & design",
        "Hardscaping (patios, walkways)",
        "Irrigation & drainage systems",
        "Outdoor recreation areas",
      ],
      image: "/images/landscaping_crew_rwanda.webp",
    },
    {
      id: "management",
      title: "Project Management",
      tagline: "On time, on budget, every time",
      short: "End-to-end project oversight ensuring on-time, on-budget, quality delivery.",
      description:
        "Our certified project managers oversee every aspect of construction from concept to completion. We coordinate contractors, manage budgets, track timelines, and ensure quality control — giving you peace of mind.",
      highlights: [
        "Full project lifecycle management",
        "Budget & cost control",
        "Timeline & milestone tracking",
        "Contractor coordination",
        "Quality assurance & inspection",
      ],
      image: "/images/construction_briefing_rwanda.webp",
    },
  ],

  about: {
    heroTitle1: "Building Rwanda's Future",
    heroTitle2: "One Structure at a Time",
    heroIntro:
      "Since 2021, ROKI Construction has been at the forefront of Rwanda's construction industry — combining international standards with local expertise to deliver exceptional results.",
    storyParagraphs: [
      "ROKI Construction was founded in Kigali with a simple mission: to transform Rwanda's built environment through quality craftsmanship, innovative design, and unwavering integrity.",
      "What started as a small team of passionate builders has grown into a full-service construction company with expertise spanning architectural design, geotechnical engineering, sustainability consulting, and project management.",
      "Every project we undertake is a promise — to our clients, to our community, and to Rwanda. We build not just structures, but lasting relationships and a sustainable future.",
    ],
    storyImage: "/images/kigali_construction_site.webp",
    values: [
      { title: "Excellence", description: "We pursue the highest standards in every project, from design to delivery." },
      { title: "Integrity", description: "Honest communication, transparent processes, and ethical business practices." },
      { title: "Innovation", description: "Embracing modern techniques, sustainable materials, and creative problem-solving." },
      { title: "Community", description: "Building a better Rwanda by investing in local talent and sustainable development." },
    ],
    team: [
      { name: "Patrick Rukundo", role: "CEO & Founder", bio: "15+ years in construction and development across East Africa.", photo: "/images/headshot_managing_director.webp" },
      { name: "Grace Mukamana", role: "Chief Architect", bio: "Award-winning architect specializing in sustainable design.", photo: "/images/headshot_lead_architect.webp" },
      { name: "Emmanuel Habimana", role: "Head of Engineering", bio: "Expert geotechnical engineer with a passion for innovation.", photo: "/images/headshot_site_engineer.webp" },
      { name: "Diane Uwimana", role: "Project Director", bio: "Certified PMP with a track record of on-time delivery.", photo: "/images/headshot_finance_lead.webp" },
    ],
  },

  testimonials: [
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
  ],

  projects: defaultProjects,
  posts: defaultPosts,

  careers: {
    intro: "Join a team that's building Rwanda's future — and invest in yours while you do it.",
    benefits: [
      { title: "Growth & Training", description: "Certification sponsorship, mentorship from senior engineers, and a real path to leadership." },
      { title: "Meaningful Work", description: "Build schools, homes, bridges, and workplaces that shape Rwanda's future." },
      { title: "Fair Compensation", description: "Competitive salaries, performance bonuses, and full statutory benefits." },
      { title: "Safety First", description: "World-class safety standards on every site — everyone goes home, every day." },
    ],
    openings: [
      {
        title: "Site Engineer",
        type: "Full-time",
        location: "Kigali",
        department: "Engineering",
        description: "Supervise day-to-day construction activities, coordinate subcontractors, and ensure works are executed to drawings, specification, and safety standards.",
        requirements: ["BSc in Civil Engineering", "3+ years site experience", "Fluent in Kinyarwanda and English", "Valid driving licence"],
      },
      {
        title: "Quantity Surveyor",
        type: "Full-time",
        location: "Kigali",
        department: "Commercial",
        description: "Prepare bills of quantities, evaluate variations, manage subcontractor accounts, and keep project cost reporting accurate and current.",
        requirements: ["Degree in Quantity Surveying or related field", "2+ years post-qualification experience", "Strong Excel / cost-software skills"],
      },
      {
        title: "Architectural Designer",
        type: "Full-time",
        location: "Kigali",
        department: "Design",
        description: "Develop concept and detailed designs for residential and commercial projects, produce presentation visuals, and support planning submissions.",
        requirements: ["Degree in Architecture", "Proficiency in Revit / ArchiCAD and rendering tools", "Portfolio demonstrating built or academic work"],
      },
      {
        title: "Health & Safety Officer",
        type: "Full-time",
        location: "Kigali / site-based",
        department: "Operations",
        description: "Own site safety across active projects: inductions, toolbox talks, inspections, incident reporting, and continuous improvement of our safety culture.",
        requirements: ["NEBOSH/IOSH certification or equivalent", "2+ years construction H&S experience", "Willingness to travel to sites across Rwanda"],
      },
    ],
    applyEmail: "careers@rokiconstruction.rw",
  },

  faqs: [
    { category: "Getting Started", q: "How do I request a quote for my project?", a: "Use the contact form on our website, call us, or email info@rokiconstruction.rw with a short description of your project. We'll arrange a free consultation — usually within 48 hours — to understand your needs before preparing a detailed, itemised quotation." },
    { category: "Getting Started", q: "Do you handle small projects, or only large developments?", a: "Both. We build everything from single-family homes and renovations to commercial towers and infrastructure. Every project gets the same professional process: proper drawings, itemised costing, and dedicated site supervision." },
    { category: "Getting Started", q: "Which areas of Rwanda do you work in?", a: "We're headquartered in Kigali and work across all of Rwanda — recent projects span Kigali, Musanze, Rubavu, Huye, and Nyungwe. For projects outside Kigali we establish a full site presence with local hiring wherever possible." },
    { category: "Costs & Contracts", q: "How much does it cost to build in Rwanda?", a: "It depends on design complexity, site conditions, and finishes — which is why we always start with a free consultation and provide an itemised bill of quantities rather than a vague lump sum. That way you see exactly where every franc goes and can adjust scope to fit your budget." },
    { category: "Costs & Contracts", q: "How are payments structured?", a: "Payments are tied to verified construction milestones — foundations complete, ring beam cast, roof on, and so forth — never to calendar dates. Your money always follows completed, inspected work." },
    { category: "Costs & Contracts", q: "What happens if I want to change something mid-project?", a: "Changes happen on almost every project, so we agree a written variations procedure before construction starts. Any change is priced and approved by you in writing before the work proceeds — no surprise costs at handover." },
    { category: "During Construction", q: "How do you keep projects on schedule?", a: "Every project has a milestone programme, a dedicated project manager, and weekly progress reports with photos. We sequence trades carefully, pre-order long-lead materials, and flag risks early — that discipline is why our on-time delivery record stands at 100%." },
    { category: "During Construction", q: "Who supervises the site day-to-day?", a: "A qualified ROKI site engineer is present on every active site, supported by our head office engineering team. You'll know your supervisor by name and have their direct contact from day one." },
    { category: "During Construction", q: "What safety standards do you follow?", a: "All sites operate under our health & safety management system: inductions for every worker, daily toolbox talks, mandatory protective equipment, and regular independent inspections. Our goal on every project is simple — zero incidents." },
    { category: "After Handover", q: "Is there a warranty on your work?", a: "Yes. Every contract includes a defects liability period after handover during which we repair any defect in workmanship at no cost. Structural elements carry longer guarantees, detailed in your contract." },
    { category: "After Handover", q: "Do you offer maintenance services after completion?", a: "We do. Many clients keep us on for planned maintenance — from annual inspections to full facilities support — so their building keeps performing the way it did on handover day." },
  ],
};

export const contentKeys = Object.keys(defaultContent) as (keyof SiteContent)[];
