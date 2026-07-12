# Canadian Blog Content + Blog Date Refresh — Design

**Date:** 2026-07-12
**Repo:** intrasyncwebsitemain (static HTML marketing site, cPanel git deploy)

## Goal

Attract Canadian precast producers — CPCI members, NPCA's Canadian members, and
CCPPA members — via targeted blog content, and fix the blog's date stamps, which
are clumped on 3–4 identical 2024/2025 dates and fingerprint the blog as
bulk-generated.

## Part 1: Seven Canadian articles

| # | Slug | Topic | Audience |
|---|------|-------|----------|
| 1 | `csa-a23-4-precast-certification-guide` | CSA A23.4 precast certification explained | CPCI / structural & architectural |
| 2 | `cpcqa-plant-certification-digital-qc` | CPCQA plant certification; how digital QC records simplify audits | CPCI |
| 3 | `pci-vs-cpci-certification-cross-border` | PCI vs CPCI/CPCQA certification for cross-border producers | Cross-border plants |
| 4 | `canada-low-carbon-concrete-epd-requirements` | Federal Greening Government / provincial buy-clean + EPDs | All Canadian producers |
| 5 | `erp-canadian-precast-gst-hst-metric` | ERP for Canadian plants: GST/HST/PST, CAD, metric, bilingual docs | All — conversion post |
| 6 | `qc-traceability-canadian-pipe-manhole-producers` | QC & traceability for pipe/manhole/box-culvert producers | CCPPA / NPCA-Canada |
| 7 | `cold-weather-precast-csa-a23-1-curing` | Cold-weather production & CSA A23.1 curing requirements | All Canadian producers |

### Content rules

- Follow `blog/_template.html` structure; `../tailwind.css` stylesheet link;
  favicon set; Apollo snippet; author Zachary Frye; FAQPage JSON-LD on each.
- Canadian spelling and metric units throughout these seven posts.
- Canada-ready product claims approved by Blake: CAD currency, GST/HST/PST
  handling, metric units, CSA-aligned QC checklists, bilingual documentation.
- Post #6 uses generic production/resource-scheduling wording — no bed/mold
  utilization language (manhole/box-culvert audience rule).
- Unlimited-seat pricing framing only; no client names; competitor claims =
  verifiable category facts only.
- Each post: card added to `blog.html`, URL added to `sitemap.xml`,
  `npm run build:css` after all pages exist.
- Publish dates: spread across early–mid July 2026 (real, recent dates).

## Part 2: Date refresh on existing posts

**Chosen approach: vary (not remove).** Dates aid freshness signals for
SEO/GEO; the problem is the clumping and staleness, not the presence of dates.

- Re-stamp ~92 existing posts across a 12-month window: **mid-July 2025 →
  early July 2026**, weighted roughly evenly (≈ 2 posts/week) so the blog
  reads as steadily active. No two posts share a date where avoidable; dates
  fall on weekdays.
- The three posts genuinely published 2026-07-11 keep their date.
- Update in all locations per post: JSON-LD `datePublished` (and add matching
  `dateModified`), visible byline date, and the year shown on the post's
  `blog.html` card.
- Assignment is deterministic (scripted, ordered list → date sequence) so it's
  reviewable in the diff; script lives in the repo under `_source/` or is
  throwaway in scratchpad (throwaway preferred — one-time migration).

## Out of scope

- French-language versions of pages (possible follow-up).
- Homepage/navigation changes beyond the new blog cards.
- Any deploy action — Blake pushes and clicks cPanel deploy per convention.

## Verification

- Every blog file parses with valid JSON-LD (script check).
- No remaining `2024-12-03`/`2024-12-06`/`2025-12-05` clumps.
- Visible date matches JSON-LD date in every post.
- `blog.html` cards and `sitemap.xml` include all 7 new posts.
- Tailwind rebuild produces no missing-class regressions on new pages.
