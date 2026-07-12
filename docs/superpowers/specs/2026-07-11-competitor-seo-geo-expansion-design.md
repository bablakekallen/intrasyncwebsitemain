# Competitor SEO/GEO Expansion: Ahead APS, Elematic, Odoo, Acumatica

**Date:** 2026-07-11
**Status:** Approved by Blake (all three surfaces, verifiable-claims-only)

## Goal

Capture search and AI-answer (GEO) traffic from precast manufacturers evaluating
Ahead APS (Progress Group), Elematic Plant Control, Odoo, and Acumatica — none of
which the site currently mentions. Source material is a Gemini competitive report;
we use its *structure* (discrete-BOM problem, spatial vs finite-capacity
scheduling, systems-layering TCO) but not its unverified claims.

## Accuracy guardrails (hard requirements)

- **No fabricated support claims.** The report's "24-hour globally distributed
  support (NA, LatAm, India, Vietnam)" contradicts actual support terms
  (6a–6p PST, 1-hr critical SLA) and is excluded entirely.
- **No invented competitor numbers** ("12–18 months of API development",
  licensing-cost claims). Competitor statements are limited to defensible
  category facts: Ahead APS is an APS scheduler that pairs with a host ERP;
  Odoo/Acumatica are general-purpose ERPs not built for precast; Elematic
  Plant Control comes from a precast machinery manufacturer's ecosystem.
- **CastLogic claims limited to what the site already states** (AI-powered
  scheduling, bed utilization / multi-cavity bed planning, GPS yard, CAD/BIM
  integration, PCI-compliant QC, integrated accounting/HR/payroll, job costing
  with WIP, cloud-native). No "parametric rebar detailing" or other new claims.

## Changes

### 1. compare.html
- Existing legacy table (BETSY/Titan3000/IDAT/IMPACT) untouched.
- New section after it: **"CastLogic vs Generic ERPs & Standalone Schedulers"**
  — second table, columns: Feature / CastLogic / Odoo / Acumatica / Ahead APS /
  Elematic Plant Control. Rows: purpose-built for precast; complete ERP with
  accounting & payroll; dimensional (per-piece) product data without discrete
  BOM explosion; casting bed utilization & layout planning; precast QC (PCI);
  works with any casting equipment; AIA-style progress billing / job costing.
- Four new "Detailed Comparison" cards in the existing card grid pattern.
- Extend ItemList schema with the four platforms; update title, meta
  description, keywords, OG/Twitter tags to include the new names.

### 2. Blog posts (3 new, from blog/_template.html)
1. `ahead-aps-vs-precast-erp.html` — "Ahead APS vs. Precast ERP: What a
   Standalone Scheduler Can't Do"
2. `generic-erp-vs-precast-odoo-acumatica.html` — "Why Generic ERPs Like Odoo
   and Acumatica Struggle with Precast Manufacturing"
3. `choosing-precast-software-purpose-built-vs-generic.html` — "Choosing
   Precast Software: Purpose-Built ERP vs. Generic ERP vs. Machinery-Tied
   Systems"

Each: Article/BlogPosting schema (existing pattern, author Zachary Frye) +
FAQPage schema (high GEO citation value), canonical URL, OG tags, related-post
links, module CTA. Dates: July 11, 2026.

### 3. Plumbing
- blog.html: three new cards, `data-category="erp"`, newest first.
- sitemap.xml: three new blog URLs + bump compare.html lastmod.
- Local commit(s) on main; dated cPanel upload zip
  (`competitor-geo-update-20260711.zip`) with changed files only.
- No push to any remote without explicit approval.

## Out of scope
- No changes to the legacy competitor table or other pages.
- No dedicated /vs-*.html landing pages (can add later if these pages perform).
