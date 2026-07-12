# Canadian Blog Content + Date Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish 7 Canadian-market blog posts and re-stamp ~92 existing posts with varied recent dates (July 2025 → July 2026).

**Architecture:** Static HTML site. New posts are modeled on `blog/ahead-aps-vs-precast-erp.html` (the current best-practice post: Article + FAQPage JSON-LD, OG tags, canonical, Apollo snippet), NOT the stale `blog/_template.html`. Date refresh is a one-time Python script run from scratchpad that keeps JSON-LD, visible byline, and blog.html card dates in sync.

**Tech Stack:** Plain HTML + built Tailwind (`npm run build:css`), Python 3 for the migration script.

## Global Constraints

- Author: Zachary Frye (CTO & Founder) in JSON-LD and byline.
- Pricing framing: unlimited seats only; never per-user. No client names. Competitor claims = verifiable category facts only. Never mention Everee.
- Canada-ready product claims approved: CAD currency, GST/HST/PST handling, metric units, CSA-aligned QC checklists, bilingual documentation.
- Post #6 (pipe/manhole audience): generic production/resource-scheduling wording — NO bed/mold-utilization language.
- Canadian spelling + metric units in the 7 new posts.
- Each new post: `<link rel="canonical">`, OG tags, Article JSON-LD, FAQPage JSON-LD (3–4 Q&As), category chip, byline (date • N min read • By Zachary Frye), related-articles grid linking real existing posts, CTA to `../contact.html`.
- Each new post gets: card in `blog.html` (with NEW badge pattern, valid `data-category` from: erp, production, quality, inventory, financial, hr, sales, compliance, technology, strategy) + `<url>` entry in `sitemap.xml` (lastmod = publish date, changefreq monthly, priority 0.6).
- New post dates: July 6–12, 2026 (weekdays where possible), matching JSON-LD, byline, card.
- The 3 posts dated 2026-07-11 (ahead-aps-vs-precast-erp, choosing-precast-software-purpose-built-vs-generic, generic-erp-vs-precast-odoo-acumatica) keep their date.
- Commit after each task; do not push (Blake pushes + cPanel deploys).

---

### Task 1: Date refresh script + apply

**Files:**
- Create: `/private/tmp/claude-501/-Users-blakeallen/7af9363d-3cba-48c7-aede-90a3ea6bf8a0/scratchpad/redate_blog.py` (throwaway — not committed)
- Modify: all `blog/*.html` except `_template.html` and the three 2026-07-11 posts; `blog.html`

- [ ] **Step 1: Write the script.** Logic:
  1. Collect posts (skip `_template.html`), read each file's `"datePublished": "YYYY-MM-DD"`. Skip posts already dated `2026-07-11`.
  2. Sort remaining posts by slug; assign dates deterministically spread evenly from 2025-07-14 to 2026-07-03, skipping weekends (advance to Monday), unique dates (~92 slots over ~355 days ≈ every 3.9 days).
  3. For each post: replace ALL occurrences of the old long-form date (e.g. `December 3, 2024`) that exactly matches the old `datePublished` rendered as `%B %-d, %Y`; replace `"datePublished": "<old>"` and `"dateModified": "<old-or-any>"` with the new date; if no `dateModified` key exists, leave as-is (only 3 modern posts have it — verify).
  4. In `blog.html`: split on `<article` boundaries; for each block, find the post href, look up its new date, and replace the old long-form date inside that block only.
  5. Print a table: slug, old date, new date; and any block where a replacement count ≠ expected (fail loudly, change nothing on error — do all replacements in memory, write only if the whole run is clean).
- [ ] **Step 2: Dry-run (script defaults to dry-run, `--write` to apply).** Verify: every post gets exactly 1 byline replacement, blog.html gets one replacement per card, zero unmatched posts.
- [ ] **Step 3: Run with `--write`.**
- [ ] **Step 4: Verify:**
  - `grep -ho 'datePublished[^,}]*' blog/*.html | sort | uniq -c | sort -rn | head` → no count > 3.
  - `grep -c '2024-12-03\|2024-12-06\|2025-12-05' blog/*.html blog.html` → 0 matches.
  - Spot-check 3 posts: JSON-LD date == byline date; blog.html card date matches.
  - Python JSON-LD parse check over every `blog/*.html` `<script type="application/ld+json">` block → all valid JSON.
- [ ] **Step 5: Commit** `git add blog/ blog.html && git commit -m "Vary blog publish dates across trailing 12 months"`

### Task 2–8: The seven articles

Each article task = create `blog/<slug>.html` (modeled byte-for-byte on the structure of `blog/ahead-aps-vs-precast-erp.html`, ~500–600 lines incl. schema), add blog.html card, add sitemap entry, commit `feat: add <slug> blog post`.

| Task | Slug | Title | Category | Date |
|---|---|---|---|---|
| 2 | `csa-a23-4-precast-certification-guide` | CSA A23.4 Certification: A Complete Guide for Canadian Precast Producers | compliance | July 6, 2026 |
| 3 | `cpcqa-plant-certification-digital-qc` | CPCQA Plant Certification: How Digital QC Records Simplify Your Audit | quality | July 7, 2026 |
| 4 | `pci-vs-cpci-certification-cross-border` | PCI vs. CPCI Certification: What Cross-Border Precast Producers Need to Know | compliance | July 8, 2026 |
| 5 | `canada-low-carbon-concrete-epd-requirements` | Canada's Low-Carbon Concrete Requirements: EPDs, GHG Limits, and What Precast Producers Must Do | compliance | July 9, 2026 |
| 6 | `erp-canadian-precast-gst-hst-metric` | ERP for Canadian Precast Plants: GST/HST, CAD, Metric Units, and Bilingual Documentation | erp | July 10, 2026 |
| 7 | `qc-traceability-canadian-pipe-manhole-producers` | QC and Traceability for Canadian Pipe, Manhole, and Box Culvert Producers | quality | July 10, 2026 |
| 8 | `cold-weather-precast-csa-a23-1-curing` | Cold-Weather Precast Production: Meeting CSA A23.1 Curing Requirements Year-Round | production | July 12, 2026 |

Key content per post (facts must stay category-verifiable):
- **Task 2:** CSA A23.4 = Canadian standard for precast concrete (materials & construction); certification via CPCI Certification / CPCQA program; audit cadence; documentation burden (mix designs, batch records, inspection & test records); how digital records help. FAQs: what is CSA A23.4; who needs certification; how long does certification take; how ERP helps.
- **Task 3:** CPCQA (Canadian Precast Concrete Quality Assurance Council) administers plant certification for structural/architectural producers; audits check QC documentation trails; pain of paper binders; digital checklists → audit-ready exports. FAQs: what is CPCQA; how often are audits; what records do auditors want.
- **Task 4:** Compare programs for plants selling into both markets: PCI (US) vs CPCI/CPCQA (Canada); overlapping but separate audits/records; imperial vs metric documentation; single-system record keeping serving both. FAQs: does PCI certification count in Canada (no — separate programs); can one QC system serve both; what differs in documentation.
- **Task 5:** Federal Greening Government Strategy low-carbon concrete requirements on federal projects; EPD requests spreading through provincial/municipal procurement; type III EPDs; mix + materials data collection is the hard part; counterpart post exists for US (`buy-clean-precast-epd-requirements.html` — link as related). FAQs: what is an EPD; do Canadian projects require them; how do I generate one.
- **Task 6 (conversion post — carries Canada-ready claims):** GST/HST/PST by province; CAD invoicing; metric-native production data; bilingual client documentation; unlimited-seat pricing note; CSA-aligned QC checklists. FAQs: does CastLogic handle GST/HST; metric units; multi-province tax; bilingual docs.
- **Task 7 (generic scheduling language only):** CSA B66 (manholes/septic), OPSS/provincial specs; per-piece traceability from batch to installation; production/resource scheduling generic wording; NPCA plant certification also relevant for Canadian utility producers. FAQs: what standards apply to Canadian pipe/manhole producers; how does traceability work; what does an inspector ask for.
- **Task 8:** CSA A23.1 curing/temperature requirements; cold-weather concreting realities (heated beds/enclosures, maturity tracking, cycle-time hit in winter); scheduling around cure times; sensor/maturity data capture. FAQs: what does CSA A23.1 require for cold weather; how does winter affect cycle times; how do plants track curing temperature.

Steps per task:
- [ ] Write `blog/<slug>.html` (head: title/meta/canonical/OG/Article JSON-LD/FAQPage JSON-LD/fonts/tailwind/Apollo; body: header nav, category chip, H1, byline, intro, 5–8 H2 sections, callout box, module CTA box to a real module page, conclusion, author bio [Zachary Frye, "Z" avatar letter], related articles (2 real posts), demo CTA, footer).
- [ ] Add card to `blog.html` after the opening of the posts grid (match NEW-badge card pattern at line ~306, correct `data-category`, date, read time).
- [ ] Add sitemap entry adjacent to other blog URLs.
- [ ] Validate JSON-LD blocks parse (python json check).
- [ ] Commit.

### Task 9: CSS rebuild + final verification

- [ ] `npm run build:css` → succeeds; `git diff --stat tailwind.css` reviewed.
- [ ] Full-site JSON-LD parse check across `blog/*.html` → 0 errors.
- [ ] Date-sync check: for each post, JSON-LD `datePublished` long-form == byline string (scripted assert).
- [ ] `blog.html` cards = 7 new; `sitemap.xml` contains 7 new URLs.
- [ ] Commit anything remaining; report summary to Blake (he pushes + deploys via cPanel).
