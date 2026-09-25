# UEMS: Universal Equity Management Solutions

Static marketing site built with **Astro + TypeScript + GSAP/ScrollTrigger**. No UI framework runtime; every interactive piece is a small scoped script.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview
```

## Pages
- `/`: home: hero cap table, paths, equity story, services, process, industries, FAQ
- `/about`: story, operating model, values
- `/contact`: consultation request (composes an email via `mailto:`; no backend)

## Home page sequence (`src/components/`)
| Section | File | Motion |
|---|---|---|
| Hero | `Hero.astro` | Serif headline + live cap-table card (Today ↔ After ₹10 Cr round) |
| What brings you to UEMS? | `Paths.astro` | Four problem-first entry cards |
| Cap table → capital | `CapTable.astro` | Pinned: 60/40 → ₹10 Cr → 48/32/20 → deployed |
| Services | `Services.astro` | Horizontal pinned panels (stacked on mobile) |
| How an engagement works | `Process.astro` | Diagnose → Structure → Facilitate → Manage, rail fills on scroll |
| Industries orbit | `Industries.astro` | Rotating orbit; hover/tap re-tunes the panel |
| Chaos → clarity | `Clarity.astro` | Pinned: fragments dissolve into a clean cap table |
| Lifecycle | `Lifecycle.astro` | Timeline draws with scroll |
| Why UEMS | `WhyUs.astro` | Expanding rows |
| FAQ | `Faq.astro` | Native `<details>` accordion |
| Final CTA | `FinalCta.astro` | The node network, resolved |

Design direction (researched against Wealthsimple, Fruitful, Incentiv, Vestd, Hissa, Qapita): warm ivory canvas, one deep forest green, Fraunces editorial serif for headlines, hairline borders, a real product artefact in the hero.

Global behaviour (section colour theming, custom cursor, reveals, nav) lives in `src/scripts/site.ts`; brand tokens are in `src/styles/global.css`.
Sections declare `data-theme="light|pale|dark"` and the page background moves between Ivory, Pale Green and Deep Forest as you scroll.
All motion respects `prefers-reduced-motion`.

## Placeholders to replace before launch
- `contact@yourfirm.com` and `+1 (800) 555-0199` (from the brief; the phone is a US toll-free format)
- `site` in `astro.config.mjs`
- The ABC Manufacturing numbers are an illustrative example and are labelled that way on the page
