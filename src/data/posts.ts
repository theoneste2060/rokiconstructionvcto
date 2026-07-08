export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO date
  readMinutes: number;
  image: string;
  author: { name: string; role: string; photo: string };
  body: string[];
  /** Rich-text HTML authored in the admin editor; overrides `body` when set. */
  bodyHtml?: string;
};

export const posts: Post[] = [
  {
    slug: "building-on-rwandan-hillsides",
    title: "Building on Rwandan Hillsides: What Every Owner Should Know",
    excerpt:
      "Rwanda is the land of a thousand hills — and building on them safely starts long before the first foundation is poured. Here's what our geotechnical team looks for.",
    category: "Engineering",
    date: "2026-05-14",
    readMinutes: 6,
    image: "/images/geotechnical_investigation_rwanda.webp",
    author: { name: "Emmanuel Habimana", role: "Head of Engineering", photo: "/images/headshot_site_engineer.webp" },
    body: [
      "Rwanda's terrain is beautiful, but it asks hard questions of anyone who wants to build on it. Slopes of 20–30 degrees are common even inside Kigali, and what looks like solid ground can hide layers of soft volcanic ash, expansive clay, or old fill.",
      "That's why every ROKI project begins with a geotechnical investigation. We drill boreholes across the site, test soil samples in the laboratory, and map how groundwater moves through the slope in both dry and rainy seasons. The result is a ground model that tells us exactly what the land can carry — and where the risks hide.",
      "The most common mistake we see is treating the investigation as a box-ticking exercise. A skipped or superficial study saves a little money up front and costs a fortune later: cracked walls, failed retaining structures, and in the worst cases, landslips that endanger neighbours downhill.",
      "For sloped sites, the design answer is usually some combination of terracing, engineered retaining walls, and careful storm-water management. Water is the real enemy on a hillside — a well-drained slope is a stable slope. Our designs always route roof and surface water into controlled channels before it can soak in behind a wall.",
      "If you're considering a hillside plot, involve an engineer before you buy, not after. An afternoon walk-over by a geotechnical engineer can flag red lines — old slip scars, seeping water, leaning trees — that change the price you should pay, or whether you should buy at all.",
      "Rwanda's hills reward those who respect them. With the right investigation and design, some of the most challenging plots become the most spectacular homes and buildings in the country.",
    ],
  },
  {
    slug: "green-building-rwanda-2026",
    title: "Green Building in Rwanda: 5 Practical Upgrades That Pay for Themselves",
    excerpt:
      "Sustainable building isn't just for flagship projects. These five upgrades consistently pay back within a few years on ordinary homes and offices in Rwanda.",
    category: "Sustainability",
    date: "2026-04-02",
    readMinutes: 5,
    image: "/images/sustainable_rooftop_kigali.webp",
    author: { name: "Grace Mukamana", role: "Chief Architect", photo: "/images/headshot_lead_architect.webp" },
    body: [
      "When clients hear 'green building', many picture expensive certifications and imported technology. The truth is more encouraging: in Rwanda's climate, the highest-impact sustainability upgrades are simple, local, and pay for themselves quickly.",
      "First, solar water heating. Heating water is one of the biggest hidden energy costs in a Rwandan home. A quality solar water heater typically pays back in two to three years and lasts fifteen.",
      "Second, rain-water harvesting. With two rainy seasons, a correctly sized tank and first-flush filter can cover most non-drinking water needs — garden, cleaning, laundry — and take real pressure off both your utility bill and the municipal supply.",
      "Third, orientation and shading. This one is free if you design it in from the start. Orienting main rooms away from the harsh western sun and shading windows with generous eaves keeps interiors comfortable without air conditioning.",
      "Fourth, LED lighting with daylight design. Pairing LED fittings with light shelves, clerestory windows, and light interior colours means most rooms need no artificial light at all during the day.",
      "Fifth, efficient charcoal alternatives or LPG-ready kitchens with proper ventilation — better for the household budget, indoor air quality, and Rwanda's forests all at once.",
      "Our sustainability consulting team models each of these for your specific site and budget, so you invest where the payback is real. Green building in Rwanda isn't a luxury — done right, it's simply better building.",
    ],
  },
  {
    slug: "how-to-choose-a-contractor",
    title: "How to Choose a Construction Contractor in Rwanda: A 10-Point Checklist",
    excerpt:
      "The contractor you choose will make or break your project. Use this checklist — drawn from what we wish every client asked us — before you sign anything.",
    category: "Project Management",
    date: "2026-02-18",
    readMinutes: 7,
    image: "/images/construction_briefing_rwanda.webp",
    author: { name: "Diane Uwimana", role: "Project Director", photo: "/images/headshot_finance_lead.webp" },
    body: [
      "Choosing a contractor is the single most consequential decision on any construction project. A good one turns a stressful year into a managed process; a bad one turns your budget into a moving target. Here is the checklist we recommend — and yes, we encourage clients to run it on us too.",
      "One: verify registration and insurance. Ask for the company's RDB registration, tax clearance, and proof of insurance. A professional firm produces these within a day.",
      "Two: visit a live site. Brochures show finished buildings; a live site shows how the contractor actually works. Look for tidy material storage, workers in proper safety gear, and a site supervisor who knows the drawings.",
      "Three: talk to past clients — especially from projects finished two or more years ago. Early defects show up in that window, and so does how the contractor handled them.",
      "Four: demand an itemised quotation. A single lump-sum figure hides everything. An itemised bill of quantities lets you compare bids fairly and manage changes honestly later.",
      "Five: agree a payment schedule tied to milestones, never to dates. Payments should follow verified progress — foundations complete, ring beam cast, roof on — so your money is always behind the work, not ahead of it.",
      "Six through ten: check who will actually supervise your site day-to-day; agree a written variations procedure before starting; confirm a defects liability period in the contract; insist on weekly progress reports with photos; and trust your instincts in the first meetings — communication problems never improve after signing.",
      "A contractor who welcomes this level of scrutiny is telling you something important. One who resists it is telling you something even more important.",
    ],
  },
  {
    slug: "kigali-construction-trends-2026",
    title: "Kigali's Construction Boom: 4 Trends Shaping the City in 2026",
    excerpt:
      "From green-certified offices to mixed-use neighbourhoods, Kigali's skyline is changing fast. Here are the trends we're seeing from the inside.",
    category: "Industry",
    date: "2026-01-09",
    readMinutes: 5,
    image: "/images/kigali_construction_site.webp",
    author: { name: "Patrick Rukundo", role: "CEO & Founder", photo: "/images/headshot_managing_director.webp" },
    body: [
      "Kigali is one of Africa's fastest-changing capitals, and 2026 is shaping up to be a defining year for its built environment. From our vantage point on sites across the city, four trends stand out.",
      "First, green certification is becoming the default for serious commercial projects. Tenants — especially international firms — increasingly ask for EDGE or equivalent certification before signing, and developers have noticed that certified buildings lease faster and hold value better.",
      "Second, mixed-use is winning. The old model of single-purpose office blocks is giving way to developments that combine retail, work, and living space. They generate footfall all day, share parking and services efficiently, and match how people actually want to live in Kigali.",
      "Third, local materials are having a renaissance. Volcanic stone, stabilised-earth brick, and Rwandan clay tile are appearing on high-end projects, not just budget ones. Architects have learned that these materials handle the climate beautifully — and clients love that their buildings feel unmistakably Rwandan.",
      "Fourth, infrastructure is unlocking new districts. Road and bridge investments are opening land that was effectively unbuildable five years ago, spreading development beyond the traditional prime hills and easing pressure on prices.",
      "For property owners and investors, the message is clear: quality, sustainability, and local character are no longer nice-to-haves in Kigali — they're what the market rewards. We're proud to be building that future, one project at a time.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
