import { useEffect, useState } from "react";
import type { SiteContent } from "~/data/content";
import { getSiteContent, resetSiteContent, saveSiteContent } from "~/server/functions";

/**
 * Schema-driven editor for every editable collection on the site. Values are
 * loaded fresh from the server, edited as flat form fields, and saved back as
 * whole JSON documents per collection key.
 */

type FieldType = "text" | "textarea" | "lines" | "paragraphs" | "pairs" | "image";

type Field = {
  key: string; // dot-path into the item/object
  label: string;
  type: FieldType;
  hint?: string;
  /** for type "pairs": the two object keys, e.g. ["value","label"] */
  pairKeys?: [string, string];
};

type Collection = {
  key: keyof SiteContent;
  label: string;
  kind: "object" | "array";
  fields: Field[];
  itemTitle?: (item: Record<string, unknown>) => string;
  blank?: () => Record<string, unknown>;
};

const knownImages = [
  "/images/hero-bg.jpg",
  "/images/roki-logo.png",
  "/images/architect_sketching.webp",
  "/images/construction_briefing_rwanda.webp",
  "/images/geotechnical_investigation_rwanda.webp",
  "/images/headshot_finance_lead.webp",
  "/images/headshot_lead_architect.webp",
  "/images/headshot_managing_director.webp",
  "/images/headshot_site_engineer.webp",
  "/images/kigali_commercial_office.webp",
  "/images/kigali_construction_site.webp",
  "/images/kigali_luxury_villa.webp",
  "/images/kigali_residential_complex.webp",
  "/images/landscaping_crew_rwanda.webp",
  "/images/rwandan_road_bridge.webp",
  "/images/rwandan_rural_school.webp",
  "/images/rwandan_warehouse.webp",
  "/images/sustainable_rooftop_kigali.webp",
];

const collections: Collection[] = [
  {
    key: "settings",
    label: "Site Settings",
    kind: "object",
    fields: [
      { key: "businessName", label: "Business Name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "seoTitle", label: "SEO Title (browser tab / Google)", type: "text" },
      { key: "seoDescription", label: "SEO Description", type: "textarea" },
      { key: "siteUrl", label: "Site URL (https://…, used for SEO tags once live)", type: "text" },
      { key: "footerBlurb", label: "Footer Blurb", type: "textarea" },
      { key: "email", label: "Email", type: "text" },
      { key: "email2", label: "Second Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "phone2", label: "Second Phone", type: "text" },
      { key: "addressLines", label: "Address (one line per row)", type: "lines" },
      { key: "hoursLines", label: "Business Hours (one line per row)", type: "lines" },
      { key: "facebook", label: "Facebook URL", type: "text" },
      { key: "twitter", label: "Twitter/X URL", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "instagram", label: "Instagram URL", type: "text" },
    ],
  },
  {
    key: "hero",
    label: "Homepage Hero",
    kind: "object",
    fields: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "titleLine1", label: "Title Line 1", type: "text" },
      { key: "titleLine2", label: "Title Line 2 (green)", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "stats", label: "Stats (Value | Label per line)", type: "pairs", pairKeys: ["value", "label"] },
      { key: "ctaPrimary", label: "Primary Button", type: "text" },
      { key: "ctaSecondary", label: "Secondary Button", type: "text" },
    ],
  },
  {
    key: "services",
    label: "Services",
    kind: "array",
    itemTitle: (i) => String(i.title ?? "Service"),
    blank: () => ({ id: "new-service", title: "", tagline: "", short: "", description: "", highlights: [], image: knownImages[2] }),
    fields: [
      { key: "id", label: "ID (url anchor, keep lowercase)", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "short", label: "Short Description (homepage card)", type: "textarea" },
      { key: "description", label: "Full Description", type: "textarea" },
      { key: "highlights", label: "Highlights (one per line)", type: "lines" },
      { key: "image", label: "Image", type: "image" },
    ],
  },
  {
    key: "about",
    label: "About Page",
    kind: "object",
    fields: [
      { key: "heroTitle1", label: "Hero Title Line 1", type: "text" },
      { key: "heroTitle2", label: "Hero Title Line 2 (green)", type: "text" },
      { key: "heroIntro", label: "Hero Intro", type: "textarea" },
      { key: "storyParagraphs", label: "Our Story (blank line between paragraphs)", type: "paragraphs" },
      { key: "storyImage", label: "Story Image", type: "image" },
      { key: "values", label: "Values (Title | Description per line)", type: "pairs", pairKeys: ["title", "description"] },
    ],
  },
  {
    key: "about",
    label: "Team",
    kind: "array",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "photo", label: "Photo", type: "image" },
    ],
    itemTitle: (i) => String(i.name ?? "Member"),
    blank: () => ({ name: "", role: "", bio: "", photo: knownImages[5] }),
  },
  {
    key: "testimonials",
    label: "Testimonials",
    kind: "array",
    itemTitle: (i) => String(i.author ?? "Testimonial"),
    blank: () => ({ quote: "", author: "", role: "" }),
    fields: [
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "author", label: "Author", type: "text" },
      { key: "role", label: "Role / Company", type: "text" },
    ],
  },
  {
    key: "projects",
    label: "Projects",
    kind: "array",
    itemTitle: (i) => String(i.title ?? "Project"),
    blank: () => ({
      slug: "new-project",
      title: "",
      category: "Commercial",
      year: "2026",
      location: "Kigali",
      image: knownImages[9],
      size: "medium",
      featured: false,
      summary: "",
      description: [],
      scope: [],
      stats: [],
    }),
    fields: [
      { key: "slug", label: "Slug (URL, lowercase-with-dashes)", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "category", label: "Category", type: "text", hint: "Commercial, Residential, Hospitality, Institutional, Infrastructure" },
      { key: "year", label: "Year", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "image", label: "Image", type: "image" },
      { key: "size", label: "Card Size (small / medium / large)", type: "text" },
      { key: "featured", label: "Featured on homepage (true / false)", type: "text" },
      { key: "summary", label: "Summary (SEO + cards)", type: "textarea" },
      { key: "description", label: "Description (blank line between paragraphs)", type: "paragraphs" },
      { key: "scope", label: "Scope of Work (one per line)", type: "lines" },
      { key: "stats", label: "Stats (Label | Value per line)", type: "pairs", pairKeys: ["label", "value"] },
    ],
  },
  {
    key: "posts",
    label: "Blog Posts",
    kind: "array",
    itemTitle: (i) => String(i.title ?? "Post"),
    blank: () => ({
      slug: "new-post",
      title: "",
      excerpt: "",
      category: "Industry",
      date: new Date().toISOString().slice(0, 10),
      readMinutes: 5,
      image: knownImages[10],
      author: { name: "", role: "", photo: knownImages[7] },
      body: [],
    }),
    fields: [
      { key: "slug", label: "Slug (URL)", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "category", label: "Category", type: "text" },
      { key: "date", label: "Date (YYYY-MM-DD)", type: "text" },
      { key: "image", label: "Image", type: "image" },
      { key: "author.name", label: "Author Name", type: "text" },
      { key: "author.role", label: "Author Role", type: "text" },
      { key: "author.photo", label: "Author Photo", type: "image" },
      { key: "body", label: "Article Body (blank line between paragraphs)", type: "paragraphs" },
    ],
  },
  {
    key: "careers",
    label: "Careers Page",
    kind: "object",
    fields: [
      { key: "intro", label: "Intro", type: "textarea" },
      { key: "applyEmail", label: "Applications Email", type: "text" },
      { key: "benefits", label: "Benefits (Title | Description per line)", type: "pairs", pairKeys: ["title", "description"] },
    ],
  },
  {
    key: "careers",
    label: "Job Openings",
    kind: "array",
    itemTitle: (i) => String(i.title ?? "Opening"),
    blank: () => ({ title: "", type: "Full-time", location: "Kigali", department: "", description: "", requirements: [] }),
    fields: [
      { key: "title", label: "Job Title", type: "text" },
      { key: "type", label: "Type", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "department", label: "Department", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "requirements", label: "Requirements (one per line)", type: "lines" },
    ],
  },
  {
    key: "faqs",
    label: "FAQ",
    kind: "array",
    itemTitle: (i) => String(i.q ?? "Question"),
    blank: () => ({ category: "Getting Started", q: "", a: "" }),
    fields: [
      { key: "category", label: "Category (groups questions)", type: "text" },
      { key: "q", label: "Question", type: "text" },
      { key: "a", label: "Answer", type: "textarea" },
    ],
  },
];

// Sub-collections that live inside a parent document rather than at the top level
const subPath: Record<string, string> = { Team: "team", "Job Openings": "openings" };

// ---------------------------------------------------------------------------
// path + field (de)serialization helpers
// ---------------------------------------------------------------------------

const getPath = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj);

const setPath = (obj: Record<string, unknown>, path: string, value: unknown) => {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (const k of keys.slice(0, -1)) {
    cur[k] = { ...((cur[k] as Record<string, unknown>) ?? {}) };
    cur = cur[k] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
};

function toText(field: Field, value: unknown): string {
  switch (field.type) {
    case "lines":
      return Array.isArray(value) ? value.join("\n") : "";
    case "paragraphs":
      return Array.isArray(value) ? value.join("\n\n") : "";
    case "pairs": {
      const [a, b] = field.pairKeys ?? ["a", "b"];
      return Array.isArray(value)
        ? value.map((v) => `${(v as Record<string, unknown>)[a] ?? ""} | ${(v as Record<string, unknown>)[b] ?? ""}`).join("\n")
        : "";
    }
    default:
      return value == null ? "" : String(value);
  }
}

function fromText(field: Field, text: string): unknown {
  switch (field.type) {
    case "lines":
      return text.split("\n").map((l) => l.trim()).filter(Boolean);
    case "paragraphs":
      return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    case "pairs": {
      const [a, b] = field.pairKeys ?? ["a", "b"];
      return text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [va, ...rest] = l.split("|");
          return { [a]: va.trim(), [b]: rest.join("|").trim() };
        });
    }
    default: {
      const t = text.trim();
      if (t === "true") return true;
      if (t === "false") return false;
      if (/^\d+$/.test(t) && field.key === "readMinutes") return Number(t);
      return text;
    }
  }
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const text = toText(field, value);
  const rows = field.type === "paragraphs" ? 8 : field.type === "textarea" ? 3 : 3;
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">{field.label}</span>
      {field.type === "text" ? (
        <input className={inputCls} value={text} onChange={(e) => onChange(fromText(field, e.target.value))} />
      ) : field.type === "image" ? (
        <span className="flex items-center gap-3">
          <input
            className={inputCls}
            list="admin-image-options"
            value={text}
            onChange={(e) => onChange(fromText(field, e.target.value))}
          />
          {text && <img src={text} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0" />}
        </span>
      ) : (
        <textarea
          className={`${inputCls} resize-y`}
          rows={rows}
          value={text}
          onChange={(e) => onChange(fromText(field, e.target.value))}
        />
      )}
      {field.hint && <span className="block mt-1 text-[11px] text-gray-400">{field.hint}</span>}
    </label>
  );
}

export function ContentEditor({ password }: { password: string }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [active, setActive] = useState(collections[0].label);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const load = async () => setContent(await getSiteContent());
  useEffect(() => {
    void load();
  }, []);

  if (!content) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Loading content…</p>;
  }

  const col = collections.find((c) => c.label === active)!;
  const sub = subPath[col.label];
  const doc = content[col.key] as unknown;
  const value = sub ? (doc as Record<string, unknown>)[sub] : doc;

  const update = (next: unknown) => {
    const nextDoc = sub ? { ...(doc as Record<string, unknown>), [sub]: next } : next;
    setContent({ ...content, [col.key]: nextDoc } as SiteContent);
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");
    const nextDoc = content[col.key];
    const result = await saveSiteContent({ data: { password, key: col.key, value: nextDoc } }).catch(() => ({ ok: false }));
    setStatus(result.ok ? "saved" : "error");
  };

  const reset = async () => {
    if (!confirm(`Reset "${col.label}" (and everything else stored under "${col.key}") to the built-in defaults?`)) return;
    setStatus("saving");
    const result = await resetSiteContent({ data: { password, key: col.key } }).catch(() => ({ ok: false }));
    await load();
    setStatus(result.ok ? "saved" : "error");
  };

  return (
    <div className="space-y-6">
      <datalist id="admin-image-options">
        {knownImages.map((img) => (
          <option key={img} value={img} />
        ))}
      </datalist>

      {/* Collection tabs */}
      <div className="flex flex-wrap gap-2">
        {collections.map((c) => (
          <button
            key={c.label}
            onClick={() => {
              setActive(c.label);
              setStatus("idle");
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              active === c.label
                ? "bg-primary text-white shadow-md"
                : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-primary/40"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Editor body */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800">
        {col.kind === "object" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {col.fields.map((f) => (
              <div key={f.key} className={f.type === "text" || f.type === "image" ? "" : "md:col-span-2"}>
                <FieldInput
                  field={f}
                  value={getPath(value, f.key)}
                  onChange={(v) => {
                    const next = { ...(value as Record<string, unknown>) };
                    setPath(next, f.key, v);
                    update(next);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(value as Record<string, unknown>[]).map((item, idx, arr) => (
              <details key={idx} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none bg-gray-50 dark:bg-gray-800/40">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {col.itemTitle?.(item) || `Item ${idx + 1}`}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.preventDefault();
                        const next = [...arr];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        update(next);
                      }}
                      className="px-2 py-1 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === arr.length - 1}
                      onClick={(e) => {
                        e.preventDefault();
                        const next = [...arr];
                        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                        update(next);
                      }}
                      className="px-2 py-1 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Delete this item?")) update(arr.filter((_, i) => i !== idx));
                      }}
                      className="px-2 py-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      aria-label="Delete item"
                    >
                      Delete
                    </button>
                  </span>
                </summary>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {col.fields.map((f) => (
                    <div key={f.key} className={f.type === "text" || f.type === "image" ? "" : "md:col-span-2"}>
                      <FieldInput
                        field={f}
                        value={getPath(item, f.key)}
                        onChange={(v) => {
                          const nextItem = structuredClone(item);
                          setPath(nextItem, f.key, v);
                          update(arr.map((it, i) => (i === idx ? nextItem : it)));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </details>
            ))}
            <button
              type="button"
              onClick={() => update([...(value as Record<string, unknown>[]), col.blank!()])}
              className="w-full px-4 py-3 text-sm font-semibold text-primary dark:text-primary-light border-2 border-dashed border-primary/40 rounded-xl hover:bg-primary/5 transition-colors"
            >
              + Add {col.label.replace(/s$/, "")}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-3">
          <button
            onClick={save}
            disabled={status === "saving"}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all duration-200 disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl hover:border-red-400 hover:text-red-500 transition-colors"
          >
            Reset to defaults
          </button>
          {status === "saved" && (
            <span className="text-sm font-medium text-primary dark:text-primary-light">✓ Saved — changes are live</span>
          )}
          {status === "error" && (
            <span className="text-sm font-medium text-red-500">Save failed — check your session and try again.</span>
          )}
        </div>
      </div>
    </div>
  );
}
