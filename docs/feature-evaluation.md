# Feature Evaluation — United Fintech Admin Portal

_Based on full AYC codebase scan and existing UF admin pages as of 2026-06-05._

---

## Keep (with rationale)

### 1. Dashboard — KPIs + Revenue/Expense Charts + AI Panel + Recent Activity
**Status: KEEP AS-IS (already built, extend data sources)**

The AYC dashboard pattern — KPI tiles at top, dual charts (revenue by period + expense by category), embedded AI chat panel, recent-activity feed — maps perfectly to ISO operations. UF already has `DashboardKPIs`, `DashboardCharts`, and `AlertsPanel` components. The architecture is sound. The KPIs change (from charter revenue to residual volume, active merchants, pending activations, chargeback ratio) but the UI pattern is identical. ISOs are data-heavy businesses; dashboard is the control center.

**ISO KPI replacements:**
- Total Residual Income (MTD) vs prior month
- Active Merchant Count
- Pending Applications in underwriting
- Portfolio Processing Volume (MRR)
- Chargeback Rate (%) — risk signal
- New Activations this month

### 2. Merchants / CRM — Kanban Pipeline + List View
**Status: KEEP AS-IS (already built as MerchantsBoard)**

The pipeline Kanban from AYC's `/clients` + `/pipeline` is the correct pattern for ISO merchant acquisition. Stages map directly: New Lead → Application Submitted → Underwriting → Approved → Active → Churned. Already implemented in UF. This is the operational heart of an ISO.

### 3. Agreements (MPAs)
**Status: KEEP AS-IS (already built as AgreementsTable)**

AYC Contracts = UF Merchant Processing Agreements (MPAs). Same document lifecycle: draft → sent → signed → active. The pattern is identical. ISOs must maintain signed MPAs for every boarded merchant. This is non-negotiable for processor relationships.

### 4. Deals & Proposals (Quotes → Rate Proposals)
**Status: KEEP AS-IS (already built as DealsTable)**

AYC Quotes (charter price proposals) = UF Rate Proposals / deal sheets. An ISO prepares interchange+ or tiered rate proposals before a merchant signs. The workflow — create proposal, attach to client/merchant, track status — is structurally identical. Already implemented.

### 5. Commissions (Payroll → Commissions)
**Status: KEEP AS-IS (already built as CommissionsTable)**

AYC Payroll (crew pay per charter) = UF Agent/Rep Commission tracking. ISO sales reps earn residuals + per-activation bonuses. Tracking by period, by rep, by merchant is essential for agent retention. Already adapted correctly. The AreaChart + BarChart combo from AYC payroll is reusable.

### 6. Residuals
**Status: KEEP AS-IS (already built as ResidualsTable)**

No AYC equivalent exists — this is an ISO-native addition already in UF. Monthly residual statements from processors (TSYS, First Data, Paysafe, etc.) need to be imported, parsed, and reconciled against expected commission. Already built.

### 7. Partner Network
**Status: KEEP AS-IS (already built as PartnersTable)**

AYC Brokers = UF Partners (referral agents, ISAs, sub-ISOs). The broker portal pattern in AYC — list of partners, their requests, messages — adapts directly. Already implemented.

### 8. KYC / Compliance
**Status: KEEP AS-IS (already built as ComplianceBoard)**

No AYC equivalent — ISO-native addition. ISOs must track KYC document collection (ID, voided check, business license, PCI attestation) per merchant. Already built.

### 9. Activity Log
**Status: KEEP AS-IS (already built)**

Universal audit trail. Directly mirrors AYC's `/activity`. Every operation in an ISO portal should generate an auditable event. Already in UF sidebar under Reporting.

### 10. Settings
**Status: KEEP AS-IS**

Universal. User management, notification preferences, processor connections, branding. No changes needed structurally.

### 11. AI Assistant
**Status: KEEP (adapt content/prompts, evaluate 3D visual)**

See AI section below.

---

## Adapt (with specific changes needed)

### 12. Calendar
**Status: ADAPT**

AYC Calendar tracks charter dates, deposit due dates, balance due dates. For ISO, it becomes a **Compliance & Pipeline Calendar**:
- Merchant onboarding follow-up reminders
- MPA expiry / renewal dates
- PCI compliance attestation deadlines
- Processor certification renewal dates
- Agent commission payout dates
- State money-transmitter license renewals

The calendar UI component itself is reusable. Content and event types change. **Not yet in UF — must be built.**

### 13. Cashflow Chart (Revenue In / Expenses Out)
**Status: ADAPT**

AYC Cashflow tracks charter deposits received vs. vessel operating expenses. For ISO, this becomes a **Residual Cashflow view**:
- Monthly residual income received (by processor/BIN)
- Agent commission payouts (expense)
- Operating expenses (SaaS, office, legal)
- Net ISO margin by month

The `CashflowChart` + `CashflowBalanceChart` + `RevenueVesselChart` component pattern from AYC is directly reusable — swap "vessel" for "processor/BIN" as the grouping dimension. **Not yet in UF — must be added to Finance section.**

### 14. Post-Charter Debrief → Merchant Review
**Status: ADAPT**

AYC Post-Charter: after each charter ends, staff log guest rating, notes, crew feedback, follow-up sent. For ISO, this becomes a **Merchant Review / Activation Debrief** triggered when a merchant goes active:
- Confirm processing volume expectations
- Log first-month performance notes
- Flag early chargeback signals
- Trigger follow-up cadence (30/60/90 day check-in)
- Rate merchant relationship quality (internal)

The star-rating + notes + follow-up-sent pattern from AYC `post-charter` maps cleanly. **Not yet in UF — should be linked from Merchants.**

### 15. Booking Flow → Merchant Onboarding Wizard
**Status: ADAPT**

AYC Booking Flow is a step-by-step form to collect charter details and generate a quote. For ISO, this becomes a **Merchant Onboarding Wizard**:
- Step 1: Business info (DBA, legal name, MCC, address)
- Step 2: Processing profile (volume, ticket sizes, card-present vs. CNP)
- Step 3: Rate proposal selection
- Step 4: Document collection checklist (MPA, ID, voided check)
- Step 5: Submit to underwriting

The multi-step form architecture from AYC is reusable. **Not yet in UF — high priority.**

### 16. Emails / CRM Communications
**Status: ADAPT**

AYC Emails: log outbound emails linked to clients, filter by CRM vs. operational. For ISO, this becomes a **Communication Log**:
- Outbound proposals and follow-ups to merchants
- Processor correspondence
- Approval/decline notifications
- Linked to merchant record, not charter record

The list + link-to-client pattern is reusable. **Not yet in UF — medium priority.**

---

## Cut (with rationale)

### 17. Captain Log
**Status: CUT — eliminated, no ISO equivalent**

AYC Captain Log tracks vessel position, fuel burn, hours underway, weather conditions. Zero ISO relevance. Already flagged for elimination.

### 18. Crew Management
**Status: CUT — eliminated, no ISO equivalent**

AYC Crew: staff roster, tip share percentage, pay rates per charter. ISO has agent/rep management (Commissions), not crew. Concept of "crew" does not exist in merchant acquiring. Already flagged for elimination.

### 19. Inventory (Beverage/Supply tracker)
**Status: CUT**

AYC Inventory: tracks yacht beverage stock by category (spirits, beer, wine) with consumption charts by guest nationality. This is 100% maritime-specific. ISO equivalent — rate card library — is handled under Deals & Proposals. No UF equivalent needed and none should be built.

### 20. Shop (Receipt Camera / Expense Capture)
**Status: CUT**

AYC Shop: mobile receipt camera to log fuel, provisions, marina fees against specific vessels. ISO does not have vessel operating expenses. Company expenses are minimal and handled by accounting software (QuickBooks), not a custom in-app camera. Cut entirely.

### 21. Snap (Mobile Expense Logger)
**Status: CUT**

Same rationale as Shop. Maritime operational expense capture via camera. No ISO equivalent. An ISO's expenses (SaaS tools, salaries, office) are tracked in accounting software, not a bespoke mobile logger.

### 22. Payables / "Did You Pay?" tracker
**Status: CUT from sidebar, ABSORB into Finance**

AYC Payables: recurring bills checklist (dock fees, fuel, insurance) with paid/unpaid toggle. ISO equivalent would be a list of monthly processor fees and SaaS subscriptions. This is too thin to warrant its own page. Absorb any recurring-bill tracking into the Cashflow/Finance view or link out to accounting software. Do not build a dedicated page.

---

## Add in Next Phase (prioritized list)

### Priority 1 — Chargeback Tracker
**ISO criticality: CRITICAL**

Chargebacks are an existential risk for ISOs. Processors will terminate a merchant (and penalize the ISO) when chargeback ratios exceed Visa/Mastercard thresholds (1% volume / 1.5% count triggers monitoring; 1.8%+ triggers termination). A dedicated tracker must:
- Log disputes by merchant, date, amount, reason code
- Calculate real-time CB ratio per merchant
- Flag merchants approaching thresholds (amber at 0.8%, red at 1.0%)
- Track dispute response deadlines (merchants have 10-45 days to respond)
- Show portfolio-level CB exposure

This feature has no AYC parallel and must be built from scratch.

### Priority 2 — Merchant Onboarding Wizard
**ISO criticality: HIGH**

The adapted Booking Flow. Multi-step form covering business info, processing profile, rate selection, document collection, underwriting submission. Reduces onboarding friction and ensures consistent data capture. Directly generates the deal record and triggers the MPA workflow.

### Priority 3 — Underwriting Queue
**ISO criticality: HIGH**

Applications submitted to processors sit in underwriting for 2-10 business days. ISOs need to track:
- Application submitted date → days in queue
- Processor assigned (TSYS, Paysafe, Worldpay, etc.)
- Status (pending, conditionally approved, approved, declined)
- Conditions outstanding (additional docs needed)
- Escalation flag for stuck applications

Currently no UF page exists for this. It is distinct from the Merchants Kanban — it is the processor-facing queue view, not the client-facing pipeline.

### Priority 4 — Residual Statement Import
**ISO criticality: HIGH**

Processors send monthly residual statements as PDFs (TSYS Residual Report, Paysafe ISO Statement, etc.). ISOs manually reconcile these against their expected commissions. Automating this via:
- PDF upload + parse (extract merchant ID, volume, interchange, fees, net residual)
- Match against active merchant roster
- Flag discrepancies (merchant missing from statement, unexpected fee)
- Export reconciled statement to CSV

This is the single most time-consuming manual task for ISO back-office and the highest-ROI automation candidate.

### Priority 5 — Calendar (Compliance & Pipeline)
**ISO criticality: MEDIUM-HIGH**

Adapted from AYC Calendar. Licensing renewals, PCI deadlines, follow-up reminders, commission payout dates. Prevents compliance lapses and missed revenue opportunities.

### Priority 6 — Cashflow / Finance View
**ISO criticality: MEDIUM**

Adapted from AYC Cashflow. Monthly residual income vs. commission payouts vs. operating expenses. Net margin by month. Rolling 12-month view. Processor-level revenue breakdown (which processor contributes most residual).

### Priority 7 — MCC Risk Concentration Chart
**ISO criticality: MEDIUM**

A portfolio-level chart showing merchant count and processing volume by MCC (Merchant Category Code). High-risk MCCs (CBD, firearms, nutraceuticals, adult content) create processor exposure. ISOs need to ensure no single high-risk MCC represents an outsized share of their portfolio. A simple donut chart + alert system handles this.

### Priority 8 — Rate Card Comparison Tool
**ISO criticality: MEDIUM**

When preparing a deal, sales reps need to compare interchange+ vs. tiered vs. flat-rate options side by side for a given merchant profile. A calculator where you input average ticket, monthly volume, card mix, and see effective rate across pricing models. Reduces proposal errors and helps reps close.

### Priority 9 — Regulatory Compliance Calendar
**ISO criticality: MEDIUM**

ISOs operating across state lines must maintain money-transmitter licenses (MTLs) in states where applicable. They also have PCI DSS scope obligations and processor certification renewals. A dedicated compliance calendar with automated reminders 90/60/30 days before deadlines prevents costly lapses.

### Priority 10 — Communication Log / Email CRM
**ISO criticality: LOW-MEDIUM**

Adapted from AYC Emails. Outbound proposal follow-ups, approval notifications, linked to merchant record. Lower priority than operational features above but important for pipeline visibility.

---

## AI Assistant Use Cases for ISO Operations

### Visual Assessment: Keep or Drop the 3D Spline Scene?

**Recommendation: KEEP the Spotlight effect, DROP the Spline 3D scene for production.**

The Spline 3D scene (`SplineScene` from `@/components/ui/splite`) is visually striking for a demo but carries real costs: ~400KB+ WASM bundle, GPU load on older machines, no meaningful semantic value for a back-office tool used all day by ISO staff. The Spotlight effect (`Spotlight` component) is CSS-only, lightweight, and creates the premium atmospheric feel without the performance hit.

Replace the 3D robot/scene with a clean animated gradient or static abstract graphic. The chat interface architecture (user/assistant bubbles, FormEvent submit, streaming) is solid and should be kept.

### Recommended AI Prompt Use Cases for ISO Operations

**Tier 1 — Immediate Value (build first):**

1. "Analyze my residual statement" — paste or upload a processor statement, get a breakdown of net residual, effective rate per merchant, flagged anomalies vs. prior month
2. "Flag merchants at chargeback risk" — AI reviews CB ratios across portfolio and surfaces merchants approaching thresholds with recommended actions
3. "Calculate effective rate for this merchant" — input volume, ticket, card mix → AI computes interchange+ cost, recommends pricing tier
4. "Draft a follow-up email for this proposal" — given merchant name and proposal details, generate a professional follow-up

**Tier 2 — High Value (build second):**

5. "Summarize this week's activations" — pull recent activations and generate an executive summary with volume estimates and partner attribution
6. "Which MCCs are overrepresented in my portfolio?" — AI analyzes MCC distribution and flags concentration risk
7. "What documents are still outstanding for [Merchant Name]?" — cross-reference onboarding checklist
8. "Compare interchange rates for [MCC] at [volume] on Visa vs. Mastercard" — rate lookup + calculation

**Tier 3 — Strategic (build when data is rich):**

9. "Which partners are sending the highest-quality merchants?" — partner performance analysis by activation rate, volume, CB ratio
10. "Predict which merchants are likely to churn in the next 90 days" — based on volume decline, CB trend, last contact date

---

## Recommended Sidebar Navigation — Final Structure

```
[United Fintech Logo]
[Admin Portal]

── OVERVIEW ──
  Dashboard

── PIPELINE ──
  Merchants          (Kanban + CRM list)
  Deals & Proposals  (Rate proposals)
  Onboarding         (NEW — adapted booking flow wizard)
  Agreements (MPAs)  (Contracts)

── RISK ──
  Chargebacks        (NEW — dispute tracker)
  Underwriting Queue (NEW — processor submission status)
  Compliance / KYC   (existing)

── FINANCE ──
  Residuals          (existing)
  Commissions        (existing)
  Cashflow           (NEW — adapted from AYC cashflow)

── PARTNERS ──
  Partner Network    (existing)

── TOOLS ──
  AI Assistant       (adapted from AYC /ai)
  Calendar           (NEW — adapted from AYC calendar)
  Communications     (NEW — adapted from AYC emails)

── SYSTEM ──
  Activity Log       (existing)
  Settings           (existing)
```

**Total nav items: 16 (currently 10). Adds 6 new pages.**

---

## Priority Order for Next Implementation Wave

Ranked by ISO operational impact × implementation complexity:

| # | Feature | Impact | Complexity | Verdict |
|---|---------|--------|------------|---------|
| 1 | Chargeback Tracker | Critical | Medium | Build immediately |
| 2 | Merchant Onboarding Wizard | High | Medium | Build immediately |
| 3 | Underwriting Queue | High | Low | Build immediately |
| 4 | Residual Statement Import (PDF parse) | High | High | Spike first, then build |
| 5 | Cashflow / Finance View | Medium | Low | Adapt from AYC cashflow |
| 6 | Calendar (Compliance + Pipeline) | Medium | Low | Adapt from AYC calendar |
| 7 | MCC Risk Concentration Chart | Medium | Low | Add to Dashboard first |
| 8 | Rate Card Comparison Tool | Medium | Medium | Build after onboarding |
| 9 | AI: Residual Analysis + CB Risk prompts | High | Low | Wire into existing /ai page |
| 10 | Communication Log | Low-Med | Low | Adapt from AYC emails |

**Immediate sprint (next 2 weeks):** Items 1, 2, 3, 5, 6, 9
**Following sprint:** Items 4, 7, 8, 10

---

_This document is a living planning artifact. Update after each sprint as features ship._
