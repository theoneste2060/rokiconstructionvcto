export type Project = {
  slug: string;
  title: string;
  category: "Commercial" | "Residential" | "Hospitality" | "Institutional" | "Infrastructure";
  year: string;
  location: string;
  image: string;
  size: "small" | "medium" | "large";
  featured: boolean;
  summary: string;
  description: string[];
  /** Rich-text HTML authored in the admin editor; overrides `description` when set. */
  descriptionHtml?: string;
  scope: string[];
  stats: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "kigali-heights-tower",
    title: "Kigali Heights Tower",
    category: "Commercial",
    year: "2025",
    location: "Kigali CBD",
    image: "/images/kigali_commercial_office.webp",
    size: "large",
    featured: true,
    summary: "A landmark 12-storey commercial tower bringing Grade-A office space to the heart of Kigali.",
    description: [
      "Kigali Heights Tower is one of the most ambitious commercial developments ROKI has delivered to date. Rising twelve storeys above the central business district, the tower offers Grade-A office space with panoramic views over the city's rolling hills.",
      "Our team handled the project end-to-end — from geotechnical investigation of the sloped site through structural engineering, curtain-wall installation, and final fit-out. The building features a double-skin glass façade that cuts solar heat gain by 35% while flooding the interior with natural light.",
      "Completed two months ahead of schedule, the tower is now home to some of Rwanda's leading financial and technology companies.",
    ],
    scope: ["Architectural design", "Structural engineering", "Curtain-wall façade", "MEP systems", "Interior fit-out", "Project management"],
    stats: [
      { label: "Floors", value: "12" },
      { label: "Floor Area", value: "18,500 m²" },
      { label: "Duration", value: "26 months" },
      { label: "Delivered", value: "2025" },
    ],
  },
  {
    slug: "green-hills-estate",
    title: "Green Hills Estate",
    category: "Residential",
    year: "2024",
    location: "Nyarutarama, Kigali",
    image: "/images/kigali_residential_complex.webp",
    size: "large",
    featured: true,
    summary: "A 48-unit gated residential community designed around shared green courtyards.",
    description: [
      "Green Hills Estate reimagines community living in Kigali. The 48-unit development is organised around a series of landscaped courtyards that give every home a view of greenery and encourage neighbours to meet.",
      "Each residence combines contemporary architecture with locally sourced materials — volcanic stone feature walls, Rwandan clay-tile roofing, and hardwood joinery from certified plantations. Rain-water harvesting and solar water heating come standard in every unit.",
      "The estate sold out before practical completion, a testament to the quality of design and construction.",
    ],
    scope: ["Master planning", "Architectural design", "Infrastructure & roads", "Landscaping", "Construction", "Quality assurance"],
    stats: [
      { label: "Homes", value: "48" },
      { label: "Site Area", value: "6.2 ha" },
      { label: "Duration", value: "20 months" },
      { label: "Delivered", value: "2024" },
    ],
  },
  {
    slug: "rwanda-innovation-hub",
    title: "Rwanda Innovation Hub",
    category: "Institutional",
    year: "2025",
    location: "Huye District",
    image: "/images/rwandan_rural_school.webp",
    size: "medium",
    featured: true,
    summary: "A community learning campus built with local brick and local hands in Huye District.",
    description: [
      "The Rwanda Innovation Hub is a learning campus that brings digital skills training and maker spaces to Huye District. The design celebrates Rwandan building traditions: hand-pressed stabilised-earth brick, timber trusses raised by local crews, and generous verandas that double as informal classrooms.",
      "Over 80% of the workforce was hired within 15 km of the site, and every artisan completed an on-the-job certification programme — leaving behind not just a building but a skilled local trades community.",
      "The campus now serves more than 1,200 learners each year.",
    ],
    scope: ["Community consultation", "Architectural design", "Local workforce training", "Construction", "Furniture & fit-out"],
    stats: [
      { label: "Buildings", value: "6" },
      { label: "Learners / yr", value: "1,200+" },
      { label: "Local hires", value: "80%" },
      { label: "Delivered", value: "2025" },
    ],
  },
  {
    slug: "lake-view-resort",
    title: "Lake View Resort",
    category: "Hospitality",
    year: "2024",
    location: "Lake Kivu, Rubavu",
    image: "/images/kigali_luxury_villa.webp",
    size: "large",
    featured: true,
    summary: "A boutique lakeside resort of 24 villas terraced into the hills above Lake Kivu.",
    description: [
      "Lake View Resort steps down the hillside above Lake Kivu in a series of terraces, so every one of its 24 villas looks straight onto the water. Infinity-edge pools, stone courtyards, and floor-to-ceiling glazing blur the line between indoors and out.",
      "Building on a 30-degree slope demanded serious geotechnical work: soil-nail retaining structures, engineered terracing, and careful storm-water management to protect the lake below.",
      "The resort opened in late 2024 and has quickly become one of the most sought-after stays in western Rwanda.",
    ],
    scope: ["Geotechnical engineering", "Slope stabilisation", "Architectural design", "Pool & landscape works", "Construction"],
    stats: [
      { label: "Villas", value: "24" },
      { label: "Slope", value: "30°" },
      { label: "Duration", value: "22 months" },
      { label: "Delivered", value: "2024" },
    ],
  },
  {
    slug: "kacyiru-business-center",
    title: "Kacyiru Business Center",
    category: "Commercial",
    year: "2023",
    location: "Kacyiru, Kigali",
    image: "/images/kigali_construction_site.webp",
    size: "medium",
    featured: true,
    summary: "A mixed-use business centre delivered on a fast-track 14-month programme.",
    description: [
      "The Kacyiru Business Center combines street-level retail with four floors of flexible office space, a stone's throw from Kigali's government quarter.",
      "The client needed doors open in time for a major tenant's lease start — a 14-month fast-track programme. We ran design and construction in parallel, pre-fabricated structural elements off-site, and sequenced trades around the clock to hand over on the exact contract date.",
      "The project is a showcase of what disciplined project management can achieve without compromising quality.",
    ],
    scope: ["Fast-track delivery", "Design-build", "Off-site prefabrication", "Retail & office fit-out"],
    stats: [
      { label: "Floors", value: "5" },
      { label: "Programme", value: "14 months" },
      { label: "Handover", value: "On the day" },
      { label: "Delivered", value: "2023" },
    ],
  },
  {
    slug: "mountainside-villas",
    title: "Mountainside Villas",
    category: "Residential",
    year: "2024",
    location: "Musanze",
    image: "/images/sustainable_rooftop_kigali.webp",
    size: "medium",
    featured: true,
    summary: "Eight net-zero-ready villas with green roofs and integrated solar, overlooking the Virungas.",
    description: [
      "Mountainside Villas pairs luxury living with genuine environmental performance. Each of the eight villas carries a planted green roof and a rooftop solar array sized to cover the home's full annual energy use.",
      "Green roofs insulate against Musanze's cool nights, manage heavy-season rainfall, and knit the homes into the hillside visually. Grey-water recycling and high-performance glazing complete the sustainability package.",
      "The development is a working demonstration of our sustainability consulting practice — proof that net-zero-ready homes can be built beautifully in Rwanda today.",
    ],
    scope: ["Sustainability consulting", "Green roof systems", "Solar PV integration", "Architectural design", "Construction"],
    stats: [
      { label: "Villas", value: "8" },
      { label: "Energy offset", value: "100%" },
      { label: "Green roof", value: "1,400 m²" },
      { label: "Delivered", value: "2024" },
    ],
  },
  {
    slug: "musanze-ridge-bridge",
    title: "Musanze Ridge Bridge",
    category: "Infrastructure",
    year: "2024",
    location: "Musanze District",
    image: "/images/rwandan_road_bridge.webp",
    size: "large",
    featured: false,
    summary: "A 180-metre road bridge connecting communities across the Musanze river valley.",
    description: [
      "The Musanze Ridge Bridge carries a district road 180 metres across a steep river valley, cutting a 45-minute detour to a two-minute crossing for the 30,000 people who live on either side.",
      "Our geotechnical team anchored the piers into volcanic bedrock after an extensive investigation programme, and the deck was cast span-by-span to keep the river corridor open throughout construction.",
      "The bridge was delivered in partnership with district authorities and now carries over 2,000 vehicle crossings a day.",
    ],
    scope: ["Geotechnical investigation", "Structural engineering", "Pier & deck construction", "Road approaches", "Safety barriers"],
    stats: [
      { label: "Length", value: "180 m" },
      { label: "Spans", value: "4" },
      { label: "Crossings / day", value: "2,000+" },
      { label: "Delivered", value: "2024" },
    ],
  },
  {
    slug: "nyarutarama-office-park",
    title: "Nyarutarama Office Park",
    category: "Commercial",
    year: "2023",
    location: "Nyarutarama, Kigali",
    image: "/images/rwandan_warehouse.webp",
    size: "medium",
    featured: false,
    summary: "A logistics and office campus with 8,000 m² of warehousing and flexible workspace.",
    description: [
      "Nyarutarama Office Park pairs modern warehousing with front-of-house office space, giving growing distribution businesses a single address for their whole operation.",
      "The 8,000 m² warehouse hall is column-free across 40-metre clear spans, built with structural steel fabricated in-country. Loading docks, a weighbridge, and secure yard circulation were designed around real logistics workflows.",
      "The park reached full occupancy within six months of completion.",
    ],
    scope: ["Steel structure design", "Warehouse construction", "Office block", "Yard & logistics planning"],
    stats: [
      { label: "Warehouse", value: "8,000 m²" },
      { label: "Clear span", value: "40 m" },
      { label: "Duration", value: "12 months" },
      { label: "Delivered", value: "2023" },
    ],
  },
  {
    slug: "rwanda-eco-lodge",
    title: "Rwanda Eco-Lodge",
    category: "Hospitality",
    year: "2025",
    location: "Nyungwe",
    image: "/images/landscaping_crew_rwanda.webp",
    size: "large",
    featured: false,
    summary: "An off-grid eco-lodge whose grounds were planted entirely with indigenous species.",
    description: [
      "On the edge of Nyungwe forest, the Rwanda Eco-Lodge runs fully off-grid on solar power and spring water. Twelve timber-and-stone cottages sit lightly on the land, connected by raised walkways that protect the forest floor.",
      "Our landscaping team restored the surrounding grounds with over 15,000 indigenous plants, re-establishing habitat corridors and giving guests gardens that belong to the landscape rather than fighting it.",
      "The lodge earned an international sustainable-tourism certification in its first year of operation.",
    ],
    scope: ["Landscape architecture", "Indigenous planting", "Off-grid systems", "Timber construction", "Raised walkways"],
    stats: [
      { label: "Cottages", value: "12" },
      { label: "Plants", value: "15,000+" },
      { label: "Grid power", value: "0%" },
      { label: "Delivered", value: "2025" },
    ],
  },
  {
    slug: "gacuriro-housing-development",
    title: "Gacuriro Housing Development",
    category: "Residential",
    year: "2023",
    location: "Gacuriro, Kigali",
    image: "/images/kigali_luxury_villa.webp",
    size: "small",
    featured: false,
    summary: "Twenty affordable family homes delivered with an efficient repeatable design.",
    description: [
      "Gacuriro Housing Development shows that affordability and quality can go hand in hand. Twenty family homes were delivered from a single, carefully optimised design — repeated with variations in orientation and finish so the street never feels monotonous.",
      "Standardisation cut construction cost per unit by 22% against comparable builds, savings that were passed to buyers. Every home still carries the ROKI hallmarks: solid masonry, quality joinery, and a private garden.",
      "All twenty homes were occupied within three months of handover.",
    ],
    scope: ["Repeatable design", "Cost engineering", "Construction", "Site infrastructure"],
    stats: [
      { label: "Homes", value: "20" },
      { label: "Cost saving", value: "22%" },
      { label: "Duration", value: "11 months" },
      { label: "Delivered", value: "2023" },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectCategories = ["All", "Commercial", "Residential", "Hospitality", "Institutional", "Infrastructure"] as const;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
