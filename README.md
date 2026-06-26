# IMPRESIVE — Official Website

**IMPRESIVE** — *International Multi-database study PREparedness: Databases Standardization,
Integration and Visualization for timely Evaluation on Disease and Treatment.*

> Prepared databases. Integrated evidence. Timely decisions.
> 準備好的資料庫，整合性的證據，及時的決策。

A clean, professional, fully static website for the IMPRESIVE international multi-database
real-world-evidence (RWE) research preparedness platform. Visual style is inspired by the AsPEN
network site, using a blue palette. No build step, no dependencies — open and deploy anywhere.

## Pages (Phase 1 — core)

| File | Page |
|------|------|
| `index.html` | Home — tagline, core values, capabilities, stats, join entries |
| `about.html` | About IMPRESIVE — origin, full name & meaning, philosophy |
| `why.html` | Why International Multi-database Studies — value, when (not) suitable |
| `methods.html` | Methods & Technology — 10-step pipeline + capability accordion |
| `databases.html` | Databases & Data Partners — database cards + readiness dashboard |
| `join.html` | Join Us — 3 partner pathways + research-proposal form |
| `contact.html` | Contact — details, routing, message form |

## Structure

```
.
├── index.html, about.html, why.html, methods.html,
│   databases.html, join.html, contact.html
├── assets/
│   ├── css/styles.css     # design tokens (blue palette) + all components
│   ├── js/main.js         # nav toggle, scroll reveal, counters, readiness bars, forms
│   └── img/favicon.svg    # network-node logo mark
└── README.md
```

## Run locally

It's pure static HTML, so you can simply double-click `index.html`. To test relative links and
fonts properly, serve over HTTP from the project root:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

```powershell
# or with Node, if installed
npx serve .
```

## Deploy

Upload the whole folder to any static host — **GitHub Pages**, **Netlify**, **Cloudflare Pages**,
**Vercel** (static), or any web server. No build is required.

## Design notes

- **Palette:** deep navy `#0A2540`, primary blue `#1565C0`, accent cyan `#38B6E0`, off-white `#F5F8FC`.
- **Type:** Inter (UI/body) + Source Serif 4 (headings), loaded from Google Fonts.
- **Responsive:** mobile-first; hamburger nav under 900px.
- **Accessibility:** semantic landmarks, `aria-current` on active nav, focus rings, reduced-motion support.

## Current limitations (no backend yet)

Forms (proposal & contact) currently use a **`mailto:` fallback** — submitting opens the user's email
client. The send address `contact@impresive.org` is a placeholder; update it in:
`join.html`, `contact.html` (the `data-mailto` attribute).

Database entries and dashboard percentages on `databases.html` are **illustrative placeholders** for
layout and should be replaced with confirmed partner data.

## Phase 2 backlog (from the project plan, not yet built)

Remaining page sections from the original plan:

- Mission & Roadmap (§8.4) — 5-phase development roadmap
- Network & Members / Governance (§8.5, §8.12) — committees, governance, ethics, transparency
- Visualization & Dashboards (§8.8) — full interactive dashboards (e.g. Chart.js / live data)
- Projects & Achievements (§8.9) — ongoing/completed studies, publications, milestones timeline
- Resources & Simulation Lab (§8.11) — templates, guides, simulated datasets, bias demos
- News & Events (§8.13)
- FAQ (§8.14)

Cross-cutting Phase 2 work:

- Full **中 / 英 bilingual toggle** (Phase 1 is English-primary with key Chinese retained)
- Real **backend**: form persistence / submission endpoint, CMS for news & results, member login
  and internal-documents area
- **Live dashboards** bound to real readiness & results data
- Simulation-data downloads
```
