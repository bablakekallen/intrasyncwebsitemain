# Design Spec — Realistic ROI Calculator Rebuild + IntraSync Site Audit Fixes

**Date:** 2026-05-30
**Branch:** `roi-calculator-and-audit`
**Status:** Draft for user review

This spec covers two bodies of work agreed during brainstorming:

- **Part A** — Rebuild `roi-calculator.html` into a credible, input-driven ROI tool.
- **Part B** — Apply the high-value audit fixes to the active marketing pages.

---

## Part A — ROI Calculator Rebuild

### A.0 The problem being fixed

The current calculator (`roi-calculator.html`) is not credible:

- Revenue-growth percentages are **hardcoded constants** (4.5%, 2.5%, 1.5%, 1.2%, 0.5% — lines 545–569). Output is always ~8.2% of revenue regardless of inputs.
- Three inputs (`leadTime`, `quoteTime`, `onTimeRate`) are collected but **never used** in the math.
- Implementation cost is faked as "55% of year-1 benefit," making payback circular.
- Cites "Aberdeen Group, Gartner, and McKinsey … and IntraSync customer case studies" — sources that do not exist on the site.

### A.1 Guiding principles

1. **Earned, not assumed.** Big numbers must emerge from the user's own inputs, never greet every visitor on load.
2. **Customer's own data carries precise dollars.** Arithmetic on the user's hours/rates/rates-of-error can be precise. Market-behavior assumptions get illustrative ranges only.
3. **Cash vs. capacity, always split.** Distinguish dollars-out-the-door from recovered labor/capacity. Never lump them.
4. **Every assumption visible and adjustable.** Conservative defaults; "here's the math, change it," not "trust us."
5. **No invented sources.** Methodology note is honest about being an illustrative estimate.

### A.2 Inputs

**Simple mode (default, low friction):**

| Input | Notes |
|---|---|
| Total employees | Drives subscription price, implementation fee, labor/close/software estimates |
| Annual revenue | Drives material-waste, rework, and revenue-upside estimates |
| **Current state** (selector) | `Mostly paper / Excel` · `Some standalone software` · `Fairly integrated` — scales achievable headroom |

**Refine mode (optional "Refine with your operational details" expander):** overrides the benchmark defaults with real figures —
data-entry hrs/week, month-end close days, finance staff count, scrap/error rate %, current on-time delivery %, # of software systems, current monthly software spend, average loaded labor rate, average quote response time, average production lead time.

When a refine field is left blank, the simple-mode benchmark (scaled by current-state) is used.

### A.3 Pricing model (the investment side)

Fixed monthly subscription, **piecewise-linear interpolation** between the real anchor points:

| Employees | Monthly | Annual | Implied $/emp/mo |
|---|---|---|---|
| ≤10 | $1,950 | $23,400 | — (floor) |
| 20 | $2,250 | $27,000 | $113 |
| 50 | $2,500 | $30,000 | $50 |
| 100 | $5,000 | $60,000 | $50 |
| 150 | $6,000 | $72,000 | $40 |
| 200 | $6,850 | $82,200 | $34 |
| 300 | $7,850 | $94,200 | $26 |

Interpolation rules:
- `≤10`: floor at $1,950/mo
- `10–20`: +$30/employee/mo (→ $2,250 @20)
- `20–50`: +$8.33/employee/mo (→ $2,500 @50)
- `50–100`: +$50/employee/mo
- `100–150`: +$20/employee/mo
- `150–200`: +$17/employee/mo
- `200–300`: +$10/employee/mo
- `>300`: continue +$10/employee/mo

**One-time implementation fee, by band:**

| Employees | Implementation |
|---|---|
| ≤50 | **$0** |
| 51–100 | $15,000 |
| 101–150 | $25,000 |
| 151–200 | $25,000 *(assumed — confirm; user gave 100–150=$25k and 200+=$35k, 150–200 not specified)* |
| 201+ | $35,000 |

`Annual investment = subscription × 12`
`Year-1 investment = (subscription × 12) + implementation fee`

### A.4 Benefit model — two buckets

All reduction percentages are scaled by a **current-state headroom factor**:

| Current state | Headroom factor |
|---|---|
| Mostly paper / Excel **(default)** | 1.0 |
| Old/legacy system, clunky or error-prone (e.g. Titan) | 0.85 |
| Some standalone software | 0.6 |
| Fairly integrated | 0.3 |

**Default = paper/Excel (1.0):** per user, most prospects run on paper/Excel or an old legacy system (Titan) that errors frequently — so paper/Excel is the *representative* default, not an inflationary one. The legacy/Titan option is high-headroom because a buggy legacy tool delivers little real integration benefit.

> **CALIBRATION NOTE:** the default baseline rates below (data-entry hrs/employee, scrap % of revenue, etc.) are defensible industry estimates but precast-specific figures should be **validated by IntraSync before launch**. They are exposed as named parameters so they are easy to tune.

#### Bucket 1 — Hard cash (dollars out the door)

| Line | Formula | Default baseline (paper state) |
|---|---|---|
| Software consolidation | `current monthly software spend × 12 × consolidation%` (or estimate: `seats × $/seat/mo × 12`) | consolidation 70%; estimate seats = employees × 0.30 |
| Material & scrap waste | `revenue × scrap% × reduction% × headroom` | scrap 2% of revenue; reduction 65% |

#### Bucket 2 — Productivity / capacity recovered (real value, labeled as recovered capacity, not a refund)

| Line | Formula | Default baseline (paper state) |
|---|---|---|
| Duplicate data entry | `hrs/emp/wk × employees × 52 × reduction% × headroom × loaded rate` | 2.5 hrs/emp/wk; reduction 70%; rate $35 |
| Drafting & drawing rework | `draft hrs/wk × 52 × reduction% × headroom × draft rate` | draft hrs = max(10, employees×0.5) — near-fixed office burden, hits small plants hardest; reduction 40%; rate $50 (DesignLogic) |
| Production scheduling | `sched hrs/wk × 52 × reduction% × headroom × planner rate` | sched hrs = max(12, employees×0.8) → ~40 hrs/wk @50 emp, crashed to ≤5; reduction 85%; rate $45 |
| Month-end close | `finance staff × close-days × 8h × 12 × reduction% × headroom × rate` | finance staff = max(1, employees×0.04); reduction 75% |

**Added 2026-05-30 per user field observations:** drafting/drawing rework (a 15–20-person shop can spend 10+ hrs/wk redrawing) and production scheduling (40 hrs/wk → ≤5 for a 50-person plant). Both are near-fixed office burdens that lift small-plant ROI. With these, default 50-emp plant ≈ 12.6×, paper 50-emp ≈ 20.6×, paper 18-emp ≈ 8.2×.
| Error/rework labor | `revenue × rework-labor% × reduction% × headroom` | rework labor 1% of revenue; reduction 70% |

`Total efficiency value = hard cash + capacity`

### A.5 Outputs / UI

1. **Hero — steady-state ROI multiple** = `total efficiency value ÷ annual subscription`, shown as e.g. "≈ 14× annual return." Moves live with every input. Worked example (50-emp, $15M, paper): ~$525K ÷ $30K ≈ **17×** (top of band); semi-digitized plants land lower — earned by the current-state input.
2. **Estimated annual investment: $X** line (Route 1 — transparency).
3. **Two-bucket breakdown** — Hard cash $X (Y×) and Recovered capacity $Z, each itemized with its inline assumption.
4. **First-year vs. steady-state** — first-year nets the one-time implementation fee: `total value ÷ (annual subscription + implementation)`. Calls out **$0 implementation / no year-1 drag for ≤50 employees**.
5. **Potential revenue upside** — separate, collapsible, **excluded from the multiple**, presented as a conservative **range**, labeled *"illustrative; depends on market demand and execution."* Two drivers only:
   - **Quote win rate** — driven by quote response time; modeled as a 1–2 pt win-rate lift on bid-driven revenue.
   - **Customer retention** — driven by on-time delivery gap to ~95%; ~1% of revenue, shrinking to zero as on-time approaches target.
   - *(Throughput / freed-capacity driver intentionally dropped: least provable, double-counts efficiency gains.)*
6. **"Adjust assumptions" panel** — exposes the key rates (70%, 75%, scrap %, rework hrs, etc.) for the user to tune.
7. **Honest methodology note** replacing the fake citations:
   > "This is an illustrative estimate generated from the figures you enter and the conservative, adjustable assumptions shown beside each line — not a guarantee. Hard-cash savings reflect dollars you stop spending; recovered-capacity figures reflect freed labor/time that converts to cash only through growth or reassignment. Revenue upside is a scenario, not a projection."

### A.6 What is removed

- Hardcoded revenue-growth constants and the dead `leadTime`/`quoteTime`/`onTimeRate` wiring.
- Fake Aberdeen/Gartner/McKinsey + "customer case studies" citation.
- Circular implementation-cost → payback math.
- "8–12% Revenue Increase" header badge and static "8–12%" / "8–12 months" placeholders.
- Fabricated 3-year compounding (optional honest "3-year cumulative, undiscounted" line may replace it).

### A.7 Accessibility (fixes audit findings H5/H6 on this page)

- Every `<label>` gets `for=` matching its input `id`.
- Results region wrapped in `aria-live="polite"`.
- Visible `:focus-visible` styles; recalculation on input remains.
- Inputs validated; guard against divide-by-zero and blank/zero inputs (show $0 / "—", never `NaN`).

### A.8 Edge cases

- Revenue or employees = 0/blank → outputs show "—", no NaN, no Infinity multiple.
- Very small plant (<10 employees) → subscription floor $2,500, $0 implementation.
- Very large plant (>300) → extrapolate subscription at +$10/emp/mo, implementation $35k.
- Multiple capped/sanity-labeled if inputs produce an implausible figure (e.g., >40× flags "verify your inputs").

### A.9 Open items needing IntraSync validation

1. Confirm 151–200 implementation fee (assumed $25k — user gave 100–150=$25k, 200+=$35k).
2. Validate precast baseline rates in A.4 (scrap %, data-entry hrs/emp, rework %).
3. Confirm default loaded labor rate ($35) and finance-staff ratio.
4. **RESOLVED (2026-05-30):** no segment difference in subscription or implementation fees.

---

## Part B — Active-Page Audit Fixes

### B.1 Scope

**In scope:** the active top-level marketing pages —
`index.html`, `about.html`, `modules.html`, `compare.html`, `faq.html`, `accounting.html`, `ai.html`, `robotics.html`, `contact.html`, `careers.html`, `certifications.html`, the module/product pages (`bidding`, `dispatch`, `schedule`, `engage`, `hr`, `stock`, `flow`, `insights`, `verify`, `site`, `stock`), plus shared assets (`site.css`, `site.js`, `robots.txt`), and a new `llms.txt`.

**Out of scope (this pass):** hand-editing all 100 blog posts (they inherit sitewide CSS/JS fixes only); standing up a Tailwind build pipeline (tracked as a follow-up — see B.5).

### B.2 Credibility / content fixes (require user-confirmed facts — see B.6)

- Un-hide the homepage counter stats so they render real numbers to no-JS/AI crawlers (animate from the real value, not from `0`).
- Resolve contradictions: founding year (2020 vs 2023), "weeks" vs "8–12 weeks," "24/7 support" vs real hours, "20%" vs "up to 10%" lead-time, "buy modules à la carte" vs "all modules included," remove "no credit card required," fix hardcoded "© 2025" on index.
- Walk back overstated claims: "SOC 2 Type II framework controls" language; present-tense roadmap features (machine vision/robotics) in `compare.html`.
- Remove "Product Demo Coming Soon" placeholder in `accounting.html` (or replace with a real asset).
- Link the ROI calculator into nav/footer (currently orphaned).

### B.3 GEO / AI-discoverability fixes

- Add `llms.txt` (and optionally `llms-full.txt`): entity definition, modules, competitive set, key facts, links.
- Fix the broken `Offer` schema in `index.html` (currently parses as price = $0).
- Extend FAQPage schema in `faq.html` to all 21 visible Q&As (currently 11).
- Fix/remove broken `assets/screenshot.png` reference in schema.
- Expand `sameAs` with any real profiles (G2/Capterra/Crunchbase) the user has.
- Rewrite or delete the stale `SEO-GEO-OPTIMIZATION-SUMMARY.md`.

### B.4 Accessibility fixes (sitewide via shared assets + key pages)

- Add a skip link + `id="main"` on `<main>`.
- Add global `:focus-visible` style in `site.css`.
- Convert click-only `<div>` controls (FAQ accordion, comparison slider, steppers) to keyboard-operable buttons with ARIA.
- Raise low-contrast `text-gray-400` (used 386×) to `text-gray-600` for real text.

### B.5 Performance fixes

- Delete the two orphaned ~5MB root PNGs (`Intrasync Materials.png`, `Intrasync Readymix.png`).
- Fix or remove the broken `../images/blog/*.jpg` references (missing `images/` dir → 404s).
- Add `width`/`height` + `loading="lazy"` to images on key pages; right-size logos.
- **Follow-up (separate task):** replace the Tailwind Play CDN (`cdn.tailwindcss.com`, on all 125 pages, render-blocking) with a built, purged CSS file. Flagged separately because it needs a build step, not a static edit.

### B.6 Factual decisions — CONFIRMED facts + remaining open items

**CONFIRMED by user (2026-05-30):**

1. **Founding year: 2024.** Both current schema values are wrong — `index.html` says 2020, `about.html` says 2023. Both must change to 2024 (and any "founded"/copyright/history copy aligned).
2. **Support hours: 6am–6pm PST.** Replace every "24/7" claim (faq.html lines ~73, 481, 580) with 6am–6pm PST.
3. **Onboarding: 4–6 months.** Contradicts BOTH the hero ("setup in weeks, not months") AND the FAQ ("8–12 weeks"). Fix both to 4–6 months.
4. **Modules: à la carte by module group** — sold as packages, not all-included. Module groups:
   - **Production** (Estimating, Production, Yard, Dispatch, QC)
   - **Accounting**
   - **BatchLogic**
   - **MaterialsLogic**
   "Purchase individual modules" framing is CORRECT; the FAQ "pricing includes all modules" line is the one to fix.
5. **Pricing: no difference between segments** (Architectural/Structural/Utility/Pipe) for subscription or implementation. Resolves A.9 item 4.

**STILL OPEN (needed before B.2/B.3 content edits):**

6. SOC 2 language — drop entirely vs. "SOC 2-aligned controls" (no audit held)?
7. Lead-time stat: 20% or 10%?
8. Any nameable customer proof / logos / testimonials, or reframe to "Built for…"?
9. Any real review profiles (G2/Capterra/Crunchbase) for `sameAs`?

---

## Sequencing

1. Part A (ROI calculator) — self-contained, no cross-page factual dependencies; build first.
2. Part B.4 / B.5 (a11y + perf) — mechanical, no content decisions; build second.
3. Part B.2 / B.3 (credibility + GEO) — after user answers B.6.
