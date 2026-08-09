# Akshat Kadam — Personal Portfolio Plan

## 1. Planning status

This document is the Phase 1 architecture plan. No application code has been created yet.

### Repository inspection

- The workspace is empty.
- There is no existing framework, package manifest, lockfile, source tree, README, hosting configuration, or Git repository.
- The implementation can therefore start cleanly without migration or compatibility constraints.
- Proposed baseline: latest stable Next.js with the App Router, TypeScript, React, Tailwind CSS, and file-based MDX content.

## 2. Product direction

The site should feel like Akshat's long-lived corner of the internet: a calm, searchable record of work, thinking, interests, and life chapters. It is not a résumé, company landing page, or lead-generation funnel.

Every page and component should answer at least one of these questions:

- What has Akshat built or helped build?
- What is he building now?
- What does he know, learn, think about, or care about?
- How do his experiences across India, Japan, education, technology, and entrepreneurship connect?

The architecture favors durable content primitives, restrained presentation, and relationships between entries. New ventures, projects, notes, essays, interests, and chapters should be additions to the system—not reasons to redesign it.

## 3. Information architecture

### Primary navigation

- **Work** — projects and case studies
- **Writing** — considered long-form articles
- **Notes** — shorter, evolving digital-garden entries
- **About** — long-form biography and personal context

### Secondary navigation

Available through a restrained menu and the command palette:

- Ventures
- Now
- Timeline
- Interests
- Library
- Lab
- Uses
- Colophon
- Contact

### Sitemap

| Route | Purpose | Primary content source |
| --- | --- | --- |
| `/` | Identity, current focus, selected work, recent writing, interests, life chapters | Structured homepage/currently data plus content collections |
| `/about` | Expandable personal biography | `content/pages/about.mdx` |
| `/work` | Filterable project directory | `content/projects/*.mdx` |
| `/work/[slug]` | Flexible project case study | Project MDX |
| `/ventures` | Businesses and organizations, distinct from projects | `content/ventures/*.mdx` |
| `/ventures/[slug]` | Optional venture profile as content grows | Venture MDX |
| `/writing` | Article index with topics and tags | `content/writing/*.mdx` |
| `/writing/[slug]` | Reading-first article page | Article MDX |
| `/notes` | Lightweight digital garden | `content/notes/*.mdx` |
| `/notes/[slug]` | Individual note | Note MDX |
| `/now` | Current priorities, projects, learning, reading, and exploration | `content/data/currently.ts` |
| `/timeline` | Filterable chronology of life and work chapters | `content/timeline/*.mdx` |
| `/interests` | Interest directory and related content | `content/interests/*.mdx` |
| `/interests/[slug]` | Interest hub with related entries | Interest MDX |
| `/library` | Books, articles, papers, podcasts, videos, tools, people | `content/library/*.mdx` |
| `/contact` | Minimal public contact destinations | Structured site data |
| `/uses` | Tools and working setup | `content/pages/uses.mdx` |
| `/colophon` | How the site is made | `content/pages/colophon.mdx` |
| `/lab` | Experiments and prototypes | Project metadata filtered to `lab` or a small lab collection |
| `/search` | Full search interface and shareable query state | Generated static search index |
| `/404` | Useful, personal dead-end recovery | Route component |
| `/sitemap.xml` | Search-engine discovery | Generated from routes and public content |
| `/robots.txt` | Crawling policy | Next.js metadata route |
| `/opengraph-image` | Default social preview | Next.js image response |

The first implementation should support all listed routes, but deeper detail routes such as venture and interest pages can remain structurally simple until their content warrants expansion.

## 4. Homepage composition

The homepage should establish identity quickly, then offer multiple ways into the archive without presenting a résumé dump.

1. **Opening** — name, concise descriptor, and Mumbai / India / Japan context. No oversized greeting or decorative hero artwork.
2. **Currently** — compact structured snapshot of building, learning, reading, and exploring. Shared with `/now`.
3. **Selected work** — four to six editorial project rows or panels, initially Zuma AI, LogiMo, To-Us, and Dayforge.
4. **Recent writing and notes** — clearly distinguish intentional articles from evolving notes.
5. **Ventures** — quiet overview of DeveLearn, Next Platforms, and Zuma.
6. **Beyond work** — interest pathways such as Japan, books, travel, fitness, and learning; unsupported personal claims remain placeholders.
7. **Chapters** — exploratory sequence from IIT Bombay through Japan, Sony, entrepreneurship, and current ventures, with uncertain dates omitted.
8. **Closing note** — an understated invitation to explore the archive or get in touch.

On small screens, content should be deliberately reprioritized: opening, currently, selected work, recent ideas, then broader directories. Dense desktop rows become compact editorial lists, not generic stacked cards.

## 5. Visual design direction

### Character

- Intelligent, quiet, editorial, curious, and technically precise
- Minimal but tactile; premium through typography, spacing, and detail rather than effects
- A personal knowledge archive with moments of warmth
- Modern without startup-template conventions

### Layout

- A wide site shell around `1200–1280px`, with generous outer gutters
- Reading measure around `700–740px`
- Asymmetric editorial grids where helpful; simple lists where a card adds no value
- Fine rules, indentation, metadata columns, and typographic hierarchy create structure
- A compact sticky header that does not dominate the viewport

### Typography

- **UI/body:** a clean variable sans such as Geist Sans
- **Editorial/display:** a restrained serif such as Source Serif 4 for article titles, quotations, and selective headings
- **Metadata/code:** Geist Mono, used sparingly
- Self-host through `next/font` where available, with carefully chosen fallbacks and minimal font weights

### Color system

Use semantic CSS variables, not hard-coded component colors:

- `--background`, `--foreground`
- `--muted`, `--muted-foreground`
- `--surface`, `--surface-raised`
- `--border`, `--border-strong`
- `--accent`, `--accent-foreground`
- `--selection`, `--code-background`

Light mode should use a warm paper-like neutral rather than pure white. Dark mode should use deep charcoal with softened text and borders—not an inverted light palette. A restrained vermilion or persimmon accent can subtly echo India–Japan context without becoming a theme gimmick. System preference is the default; an accessible user override is persisted locally.

### Imagery

- Do not add stock imagery or generic AI art.
- Prefer supplied documentary photos, product screenshots, diagrams, and real project artifacts when they become available.
- Until then, use typographic covers and explicitly labeled placeholders.
- Project cover fields are optional so missing imagery never produces empty decorative boxes.

### Motion and interaction

- Short opacity/translate reveals, underline movement, filter transitions, and quiet hover disclosure
- Command palette via `Cmd/Ctrl + K`; `/` can focus search when it does not interfere with text input
- Visible focus states and complete keyboard operation
- `prefers-reduced-motion` disables nonessential animation
- No scroll hijacking, parallax, animated cursor, blobs, or continuous movement

## 6. Content architecture

### Proposed folders

```text
content/
  writing/
  notes/
  projects/
  ventures/
  timeline/
  interests/
  library/
  pages/
  data/
    currently.ts
    navigation.ts
    site.ts
public/
  images/
    projects/
    writing/
    timeline/
```

MDX stores narrative content. TypeScript stores small, highly structured site-wide data. Frontmatter is validated at build time with Zod. Content access is isolated behind repository functions so a future CMS changes adapters, not page components.

### Shared fields

All public content entries share a small base:

```ts
type ContentBase = {
  id: string
  slug: string
  title: string
  summary?: string
  status: 'draft' | 'published' | 'unlisted'
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
  relationships?: ContentRef[]
  seo?: SeoFields
}

type ContentRef = {
  type: 'project' | 'venture' | 'article' | 'note' | 'interest' | 'timeline' | 'library'
  id: string
}
```

`draft` entries are excluded from production indexes and feeds. `unlisted` entries can be public by direct URL but excluded from navigation, search, sitemap, and related-content modules. This provides a simple publication boundary without pretending file content is a secrets store.

### Project

```ts
type Project = ContentBase & {
  kind: 'project'
  subtitle?: string
  projectStatus: 'active' | 'ongoing' | 'completed' | 'archived' | 'experiment' | 'paused'
  period?: { start?: string; end?: string; label?: string }
  categories: Array<'company' | 'product' | 'client-work' | 'ai' | 'education' | 'software' | 'japan' | 'experiment'>
  role?: string[]
  technologies?: string[]
  externalUrl?: string
  cover?: Media
  ventureIds?: string[]
  interestIds?: string[]
  featured?: boolean
}
```

The MDX body can use optional case-study sections such as overview, motivation, role, problem, approach, technology, decisions, results/status, lessons, gallery, and related writing. Render only supplied sections.

### Venture

```ts
type Venture = ContentBase & {
  kind: 'venture'
  role?: string
  organizationStatus?: 'active' | 'previous' | 'unknown'
  focusAreas?: string[]
  externalUrl?: string
  logo?: Media
  projectIds?: string[]
  interestIds?: string[]
}
```

A venture is an organization Akshat is involved with; a project is a discrete product, engagement, or experiment. For example, Zuma is a venture and Zuma AI is a project.

### Article

```ts
type Article = ContentBase & {
  kind: 'article'
  subtitle?: string
  cover?: Media
  readingTime?: number
  toc?: boolean
  canonicalUrl?: string
}
```

Article MDX supports headings, table of contents, footnotes, syntax-highlighted code, quotations, responsive images, callouts, and external citations. Reading time and heading structure should be derived during content compilation where possible.

### Note

```ts
type Note = ContentBase & {
  kind: 'note'
  noteStatus?: 'seedling' | 'growing' | 'evergreen'
}
```

Notes use lighter templates and can be short or unfinished. Relationships enable future backlinks; backlinks are derived at build time rather than manually duplicated.

### Timeline event

```ts
type TimelineEvent = ContentBase & {
  kind: 'timeline'
  date?: string
  endDate?: string
  dateLabel?: string
  eventType: 'education' | 'job' | 'company' | 'product' | 'travel' | 'milestone' | 'project' | 'life'
  location?: string
  featured?: boolean
}
```

Unknown dates use `dateLabel` or are omitted; no dates will be inferred.

### Interest

```ts
type Interest = ContentBase & {
  kind: 'interest'
  icon?: string
  featured?: boolean
}
```

Interest pages query relationships and tags to collect related projects, writing, notes, and library entries.

### Library entry

```ts
type LibraryEntry = ContentBase & {
  kind: 'library'
  mediaType: 'book' | 'article' | 'paper' | 'podcast' | 'video' | 'tool' | 'software' | 'person'
  creator?: string
  consumptionStatus?: 'want-to-explore' | 'in-progress' | 'completed' | 'reference'
  rating?: number
  externalUrl?: string
}
```

Ratings and personal notes remain absent until explicitly supplied.

### Currently data

```ts
type Currently = {
  lastUpdated: string
  building: CurrentItem[]
  learning: CurrentItem[]
  reading: CurrentItem[]
  exploring: CurrentItem[]
}
```

This powers both the homepage snapshot and the full `/now` page.

### Initial content policy

Create public entries only from supplied facts:

- Ventures: DeveLearn, Next Platforms, Zuma
- Projects: Zuma AI, LogiMo, To-Us, Dayforge
- Interests: broad topic shells such as AI, education, Japan, entrepreneurship, software, history, economics, geopolitics, philosophy, fitness, travel, and books
- Timeline: undated chapter-level entries for IIT Bombay, Japan, Sony, entrepreneurship, and current ventures

Where LogiMo, To-Us, or Dayforge details have not been provided, their entries should be explicitly marked as placeholders and contain no invented descriptions. Example/template content belongs in draft files excluded from production.

## 7. Application architecture

### Proposed source tree

```text
src/
  app/
    (site)/
      page.tsx
      about/page.tsx
      work/page.tsx
      work/[slug]/page.tsx
      ventures/page.tsx
      ventures/[slug]/page.tsx
      writing/page.tsx
      writing/[slug]/page.tsx
      notes/page.tsx
      notes/[slug]/page.tsx
      now/page.tsx
      timeline/page.tsx
      interests/page.tsx
      interests/[slug]/page.tsx
      library/page.tsx
      contact/page.tsx
      uses/page.tsx
      colophon/page.tsx
      lab/page.tsx
      search/page.tsx
    api/search/route.ts
    layout.tsx
    not-found.tsx
    globals.css
    sitemap.ts
    robots.ts
    manifest.ts
    opengraph-image.tsx
  components/
    layout/
    navigation/
    content/
    work/
    writing/
    search/
    timeline/
    seo/
    ui/
  lib/
    content/
      schemas.ts
      loader.ts
      repositories.ts
      relationships.ts
      search-index.ts
    metadata.ts
    analytics.ts
    utils.ts
  styles/
```

### Component hierarchy

```text
RootLayout
├── SkipLink
├── SiteHeader
│   ├── Wordmark
│   ├── PrimaryNav
│   ├── ThemeControl
│   └── MenuTrigger
├── PageShell
│   └── Route content
├── SiteFooter
└── CommandPalette
    ├── Page commands
    └── Search results
```

Core reusable components:

- **Layout:** `Container`, `ContentColumn`, `PageHeader`, `Section`, `Divider`
- **Navigation:** `SiteHeader`, `PrimaryNav`, `MobileMenu`, `CommandPalette`, `Breadcrumbs`
- **Content:** `ContentList`, `ContentMeta`, `TagList`, `StatusMark`, `RelatedContent`, `EmptyState`
- **Work:** `ProjectIndex`, `ProjectRow`, `ProjectFilters`, `ProjectHeader`, `ProjectGallery`
- **Writing:** `Prose`, `ArticleHeader`, `TableOfContents`, `Footnotes`, `Callout`, `CodeBlock`
- **Knowledge:** `Backlinks`, `InterestIndex`, `TimelineExplorer`, `LibraryIndex`
- **System:** `SearchDialog`, `ThemeProvider`, `JsonLd`, `AnalyticsProvider`

Prefer Server Components. Client components are limited to theme switching, command palette/search interaction, filters, mobile navigation, and optional timeline interaction. URL query parameters should hold filter/search state so views remain linkable and work without opaque global state.

## 8. Content pipeline and search

1. Discover MDX files by collection.
2. Parse and validate frontmatter with collection-specific Zod schemas.
3. Compile MDX with a controlled component map.
4. Derive slug, reading time, headings, and excerpt when appropriate.
5. Resolve IDs and validate relationships at build time.
6. Exclude drafts and unlisted content according to environment and context.
7. Expose typed repository methods such as `getProjects()`, `getArticleBySlug()`, and `getRelatedContent()`.
8. Generate a compact JSON search index containing title, summary, tags, type, slug, and normalized body excerpt.

Search is client-side in V1. Load the index only when the command palette or `/search` is used. Use a small weighted matcher rather than a search service; titles and tags rank above summaries and body excerpts. The palette includes static navigation plus projects, articles, notes, and interests.

## 9. SEO and sharing

- Central `siteConfig` for canonical origin `https://akshatkadam.com`, name, description, and public profiles
- Reusable `buildMetadata()` for canonical URLs, Open Graph, and X cards
- Dynamic metadata for every content detail page
- Person JSON-LD on the homepage/about page using only confirmed facts
- Article JSON-LD on published articles
- Breadcrumb JSON-LD on detail pages
- Generated sitemap excluding draft and unlisted entries
- `robots.txt`, web manifest, and sensible icon placeholders
- Dynamic default and per-content social images using Next.js `ImageResponse`, designed from typography and metadata rather than invented visuals
- Optional RSS/Atom feed for writing and notes during the publishing phase

## 10. Accessibility and performance guardrails

- Semantic landmarks, logical heading order, skip link, descriptive labels, and keyboard-accessible dialogs/menus
- Focus is trapped and restored correctly in the command palette and mobile menu
- Status is never communicated by color alone
- WCAG AA contrast in both themes
- Touch targets remain comfortable without making desktop navigation bulky
- Reduced-motion styles are part of the base design system
- Server-render most content; hydrate only interactive islands
- Use `next/image` with explicit sizes for supplied media
- Subset fonts and load only required weights
- Keep MDX processing at build time and avoid shipping parsers to the browser
- Lazy-load the search index and noncritical interactive modules
- No analytics package initially; `track(event)` is a no-op adapter that can later target Plausible, Umami, or Vercel Analytics

## 11. Delivery phases

Each phase begins with inspection, makes the smallest coherent set of changes, updates this plan, and ends with lint, TypeScript checks, and a production build. Visual browser QA should cover representative desktop and mobile widths once pages exist.

### Phase 1 — Architecture (complete)

- Inspect repository
- Define sitemap, visual system, content models, relationships, and component boundaries
- Create `PLAN.md`

### Phase 2 — Foundation and homepage (initial landing page complete)

- Initialize the Next.js application and core dependencies — complete
- Establish the initial visual system, typography, global layout, header, footer, and responsive behavior — complete
- Build the first public landing page with identity, current focus, ventures, life chapters, and AI assistant integration point — complete
- Add typed site/currently data, theme preference, menu, and command palette shell — deferred to the full homepage phase

### Phase 3 — Identity and work

- Add About, Work, project details, Ventures, venture details, and Now
- Seed only verified content and clearly labeled placeholders
- Add project filtering, relationship rendering, and status marks

### Phase 4 — Publishing system

- Add MDX compilation and validation
- Build Writing, article, Notes, and note templates
- Add prose components, table of contents, footnotes, code highlighting, tags, backlinks, and related content
- Generate and integrate the search index

### Phase 5 — Knowledge archive

- Add Timeline, Interests, interest hubs, Library, Lab, Uses, and Colophon
- Connect content through IDs/tags and validate all references

### Phase 6 — Polish and launch readiness

- Complete accessibility, responsive, reduced-motion, and performance review
- Add SEO metadata, structured data, sitemap, robots, feed, social images, manifest, and 404
- Write the comprehensive README and `.env.example`
- Run clean install, lint, typecheck, production build, and representative route checks
- Prepare Vercel deployment configuration without coupling the architecture to Vercel

## 12. Definition of done for the full implementation

- All planned routes render and degrade gracefully with sparse content
- Content can be added primarily by creating MDX files with validated frontmatter
- No unsupported personal, commercial, or confidential details are published
- Keyboard navigation, theme behavior, search, and filters are accessible
- Mobile layouts are intentionally composed, not merely stacked desktop cards
- Metadata, structured data, sitemap, robots, and social previews use canonical production URLs
- Lint, TypeScript checks, and production build pass
- README documents architecture, setup, content authoring, images, deployment, SEO, environment variables, homepage editing, and future CMS migration

## 13. Decisions deferred until implementation

- Exact latest stable package versions, determined when the app is initialized
- Whether the MDX compiler uses the Next.js MDX integration or a small remote/compiler utility, chosen after checking current stable compatibility
- Final font pairing after measuring weight, language coverage, and loading cost
- Real contact/profile URLs, project URLs, dates, imagery, and deeper personal copy, all awaiting explicit public information
- Analytics provider; the adapter remains provider-neutral
