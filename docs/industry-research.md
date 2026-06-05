# United Fintech — ISO Industry Research Report

**Prepared by:** Research Agent
**Date:** 2026-06-05
**Purpose:** Feature validation and gap analysis for the United Fintech admin portal. This report informs the feature evaluator agent and the design team.

---

## Context: What Is United Fintech's Business Model

United Fintech is an Independent Sales Organization (ISO) — a merchant account broker that signs agreements between merchants and acquiring banks/processors. Revenue is earned as residual income: a small slice (typically 5–25 basis points) of every dollar a placed merchant processes, paid monthly for the life of the account. Portfolio retention is therefore the single most critical business outcome — every merchant that churns reduces recurring revenue permanently.

---

## 1. Top 10 KPIs for an ISO Dashboard (Ranked by Importance)

Ranked by operational impact on revenue, risk, and compliance.

### 1. Monthly Residual Revenue (Net)
The core revenue metric. Total residual income received from all processors for the month, net of expenses and sub-ISO splits. Should be shown MTD, with prior-month and YTD comparisons. Drill-down to per-processor and per-merchant is required for reconciliation. Industry tools like IRIS CRM and ISOhub expose this as the primary dashboard metric.

**Current status in portal:** Present as a KPI card (MTD $193,282 mock). Needs drill-down to per-merchant and per-processor breakdown.

### 2. Total Processing Volume (Portfolio)
The aggregate dollar volume processed by all merchants in the portfolio, month-to-date and trailing 12 months. Volume directly determines residual income (residual = volume × bps spread), so volume trends predict revenue 30–45 days forward.

**Current status:** Present on main dashboard as MTD Volume card.

### 3. Chargeback Rate (Portfolio and Per-Merchant)
The single most compliance-critical metric. Visa's new VAMP program (effective October 2025, threshold tightening April 2026) requires acquirers to hold the combined fraud+dispute ratio below 0.5% of card-not-present transactions. Mastercard's threshold is 1.5% / 100 chargebacks per month at the excessive level. Any merchant exceeding 1% is a liability that can trigger processor fines on the ISO.

The chargeback rate must be tracked at two levels:
- **Portfolio level** (aggregate, shown on main dashboard)
- **Merchant level** (per-MID, with red/amber/green threshold coloring)

Color thresholds for display:
- Below 0.5%: green (safe)
- 0.5%–1.0%: amber (approaching — monitor)
- Above 1.0%: red (exceeds threshold — immediate action)
- Above 1.5%: critical red (Mastercard excessive — processor fine risk)

**Current status:** Portfolio-level chargeback rate is present (0.38% mock, green). Per-merchant chargeback tracking is NOT present — this is a major gap.

### 4. Active Merchant Count
Count of live, processing merchant accounts, broken down by account type (Card Present, eCommerce, MOTO). New activations minus attrition equals net portfolio growth.

**Current status:** Present on dashboard (214 merchants mock).

### 5. New Merchant Activations (MTD)
Count of newly activated merchant accounts this month. The primary growth metric. Should include time-to-activation (days from application submission to first transaction) to identify underwriting bottlenecks.

**Current status:** Present (18 activations MTD mock). Time-to-activation tracking is NOT present.

### 6. Portfolio Attrition Rate
The percentage of merchants who closed or left the portfolio in a rolling 90-day or 12-month window. This is the silent revenue killer — attrition at 2% monthly can erase growth from new activations. The industry tracks this as "lost merchants" and reasons for attrition (competitor, closure, fee dispute, chargeback termination).

**Current status:** NOT present. Major gap.

### 7. Application Approval Rate
Percentage of submitted merchant applications approved by the processor's underwriting department. A low approval rate (below 70%) signals either poor lead qualification by the sales team or underwriter relationship issues with the processor.

**Current status:** NOT present. Should be tracked on the underwriting queue page.

### 8. Residual BPS (Basis Points) per Merchant
The effective margin the ISO earns on each merchant's volume, expressed in basis points. This allows identification of underperforming accounts where the spread has compressed (often due to rate concessions) and high-value accounts to protect and grow.

**Current status:** NOT present as a per-merchant metric. The residuals table would need a BPS column alongside dollar amounts.

### 9. MCC Concentration Risk
The distribution of merchant accounts across Merchant Category Codes (per ISO 18245:2023). ISOs with excessive concentration in high-risk MCCs (online gambling, pharmaceuticals, adult content, firearms) face elevated chargeback exposure and potential processor termination. Visa and Mastercard both require acquirers to monitor and periodically re-verify MCC assignments. Portfolio-level MCC breakdown should be visible as a pie/donut chart.

**Current status:** NOT present. No MCC field visible in current merchant data model.

### 10. Sub-ISO / Partner Commission Payouts
Monthly commission amounts owed to referring agents, sub-ISOs, and partners based on the residual splits defined in the Schedule A agreement. This is both a financial liability (cash out) and a relationship management metric — late or incorrect payouts damage partner trust.

**Current status:** A Commissions page exists. Needs verification that it supports split calculations and Schedule A–based rules.

---

## 2. Must-Have Pages / Features (Industry-Validated)

These are features present in all major ISO CRM platforms (IRIS CRM / Merchant Central by NMI, ISOhub, Pulse CRM) and without which the portal is functionally incomplete as an operations tool.

### 2.1 Residuals Module
**What it must do:**
- Import or manually enter monthly residual statements from each processor (First Data/Fiserv, TSYS, Worldpay, etc.)
- Reconcile the statement against the expected residual based on volume × schedule A
- Flag discrepancies (a flagged fluctuation on a steady-volume account is a red flag indicating processor error or portfolio erosion)
- Show per-merchant residual: dollars earned, BPS effective rate, volume processed
- Show YTD and lifetime residual per merchant
- Show 12-month trailing chart per merchant and portfolio-wide

**Current status:** A ResidualsTable component exists. It needs the per-merchant BPS column, the statement import/upload workflow, and the reconciliation discrepancy flag.

### 2.2 Chargeback Tracker (Dispute Queue)
**What it must do:**
- List all open disputes/chargebacks across the portfolio, sourced from processor data or manual entry
- Show merchant name, MID, dispute amount, card brand, reason code, filing date, response deadline
- Color-code merchants by chargeback ratio (green/amber/red)
- Send automatic alerts when a merchant crosses the 0.5% or 1.0% threshold
- Log the ISO's response actions (notification sent to merchant, documentation filed, outcome)

This is a regulatory and revenue-protection requirement. Visa VAMP enforcement began October 2025 — ISOs are now directly accountable for merchant chargeback levels.

**Current status:** The alerts panel surfaces a high-chargeback flag, but there is no dedicated Chargeback Tracker page. This is the most critical missing feature from a compliance standpoint.

### 2.3 Underwriting Queue (Application Pipeline)
**What it must do:**
- Track every merchant application from lead → submitted → under review → approved / declined / pended
- Store the documents collected for each application (business license, voided check, bank statements, processing history, MPA/agreement, ID)
- Show processor decision and underwriter notes
- Calculate and display time-to-activation per application
- Show approval rate as a funnel metric
- Allow status updates and document uploads

The Deals page likely partially covers this, but the underwriting workflow requires document management and status tracking that a generic "deals" CRM may not provide.

**Current status:** A DealsTable exists. Needs to be evaluated for underwriting-specific stages and document attachment capability.

### 2.4 Merchant Profile with Risk Indicators
**What it must do:**
- Full merchant record: business name, DBA, MID, MCC, account type, processor, partner/ISO, date activated, contact info
- Current month and trailing 12-month volume trend (sparkline)
- Current chargeback ratio with threshold indicator
- BPS earned by this merchant this month and trailing 12 months
- Compliance review due date (PCI questionnaire expiry, 90-day review, annual review)
- Open disputes count
- Notes / activity log

**Current status:** A MerchantsBoard exists. The profile detail page needs risk indicator fields.

### 2.5 Partner / Sub-ISO Management
**What it must do:**
- Record each partner/sub-ISO with their Schedule A commission split
- Show merchants attributed to each partner
- Calculate monthly commission owed per partner from residual data
- Show partner's total portfolio volume and contribution to ISO revenue
- Track partner compliance registration status (required by Visa's TPA Registration Program)

**Current status:** A PartnersTable exists. Needs Schedule A integration and commission calculation from residuals.

### 2.6 Compliance & PCI Monitoring
**What it must do:**
- Track each merchant's PCI DSS validation status and next expiry date
- Flag overdue PCI questionnaires (non-compliance is a monthly fine from processors)
- Show 90-day review queue for recently onboarded or flagged merchants
- Track state licensing status for the ISO itself
- Log all compliance actions taken with timestamps (audit trail)

**Current status:** A ComplianceBoard exists. Quality needs verification.

### 2.7 Agreements / MPA Management
**What it must do:**
- Store executed Merchant Processing Agreements (MPAs) for each merchant
- E-sign integration (pending signature tracking — already reflected in alerts)
- Rate schedule / pricing stored per merchant
- Renewal and rate review dates

**Current status:** An AgreementsTable exists. E-sign pending alerts are surfaced in the alerts panel (good).

---

## 3. Nice-to-Have Pages / Features

These add operational value but are not blockers for day-one operations. Prioritize in Phase 2 or Phase 3.

### 3.1 Residual Statement Import (PDF / CSV Parser)
Processor residual statements are delivered as PDFs or CSV exports. An import tool that parses these files and auto-populates the residuals module would save hours of monthly reconciliation work. IRIS CRM integrates directly with processor APIs for this. For a custom portal, a CSV upload with column mapping is a practical Phase 2 feature.

### 3.2 MCC Risk Heat Map
A visual display of the portfolio's MCC distribution — a donut chart or table showing how many merchants and what percentage of portfolio volume sit in each MCC category, with high-risk MCCs flagged. Useful for quarterly portfolio reviews and processor relationship conversations.

### 3.3 Portfolio Attrition Tracker
A report showing merchants who closed or transferred in the trailing 30/90/365 days, with attrition reason codes (competitor, closure, chargeback termination, fee dispute, processor change). Revenue impact of attrition displayed as "lost monthly residual" to quantify churn in dollars.

### 3.4 Rate Review Queue
A list of high-volume merchants due for a scheduled rate review (typically annual or triggered by volume crossing a threshold). ISOs often renegotiate interchange pass-through arrangements for merchants processing above $500K/month. This generates goodwill and reduces churn risk from competitors.

### 3.5 AI-Assisted Residual Statement Analysis
See Section 7 for full AI assistant use cases.

### 3.6 Email CRM Integration
Outbound email log tied to merchant or partner records — tracking proposal sends, follow-ups on unsigned agreements, chargeback notification emails, and rate review meetings. A basic mailto: integration with activity log is sufficient for Phase 1; a full SMTP send-from-portal with template management is Phase 2.

### 3.7 Mobile Field App / Simplified View
Sub-ISOs and field agents need a simplified mobile view to submit new deals, check their pipeline, and see their residual. ISOhub's mobile app is cited as a differentiator by field agents. This is a Phase 3 consideration.

### 3.8 Merchant 30-Day Activation Review
An adapted version of the AYC "post-charter debrief" concept: 30 days after activation, trigger an automatic review task to verify the merchant is processing, check their chargeback rate, confirm POS equipment is working, and address any early dissatisfaction. This is a retention driver.

---

## 4. Cut List (Not Relevant to ISO Operations)

These features exist in the AYC yacht charter portal but do not map to ISO operations and should not be ported.

| AYC Feature | Verdict | Reason |
|---|---|---|
| Inventory (drinks, food, supplies) | Cut | ISOs have no physical inventory |
| POS receipt capture / shop | Cut | No retail point-of-sale operations |
| Vessel maintenance schedule | Cut | No physical assets to maintain |
| Charter calendar / booking calendar | Adapt | Repurpose as meeting / review calendar only |
| Guest/crew management | Cut | No guest management equivalent |
| Port/route planner | Cut | No geographic routing |
| Fuel log | Cut | No operational logistics |
| Post-charter debrief (as-is) | Adapt | Adapt to merchant 30-day activation review |

---

## 5. Gap Analysis — What Is Missing from Current Admin Portal

The following features are absent from the current build and represent real operational gaps compared to industry-standard ISO tools.

| Gap | Priority | Impact | Recommended Action |
|---|---|---|---|
| Per-merchant chargeback ratio tracking | CRITICAL | Regulatory (Visa VAMP) + revenue risk | Add chargeback ratio column to MerchantsBoard; create dedicated Chargeback Tracker page |
| Dedicated Chargeback Dispute Queue | CRITICAL | Compliance, processor fines | New page: /admin/chargebacks with dispute log, deadlines, status tracking |
| Portfolio attrition tracking | HIGH | Revenue — silent churn erodes residuals | Add attrition report to Residuals module; track reason codes |
| Per-merchant BPS (basis points) column | HIGH | Revenue management | Add BPS field to ResidualsTable alongside dollar amounts |
| Time-to-activation metric | HIGH | Sales efficiency | Track application submission date vs. first transaction date; expose in underwriting queue |
| Residual statement reconciliation | HIGH | Financial accuracy | Add reconciliation flag comparing received vs. expected residual per processor |
| MCC field on merchant records | MEDIUM | Risk management | Add MCC to merchant data model; build MCC distribution chart |
| Application approval rate funnel | MEDIUM | Sales efficiency | Derive from underwriting queue: submitted / approved / declined |
| Partner Schedule A commission calculation | MEDIUM | Partner relations | Link partner records to residual data; apply split rules |
| Merchant 30-day activation review queue | MEDIUM | Retention | Auto-create review task at T+30 days after activation |
| PCI DSS status tracking per merchant | MEDIUM | Compliance, processor fines | Add PCI fields to merchant record; build compliance calendar |
| Rate review queue | LOW | Revenue optimization | Flag merchants by volume threshold and last review date |

---

## 6. Calendar Integration Recommendations

A calendar feature for ISO operations serves three distinct purposes, all of which are operationally important.

### 6.1 Compliance Review Calendar
- PCI DSS questionnaire expiry dates per merchant
- Annual and 90-day merchant risk reviews
- Processor audit deadlines
- State ISO license renewal dates

This is the highest-priority calendar use case. Missed compliance dates incur direct financial penalties from processors (typically $25–$100/month per non-compliant merchant for PCI failures).

### 6.2 Partner and Merchant Meeting Calendar
- Scheduled calls with sub-ISO partners for pipeline review
- Rate review meetings with high-volume merchants
- Onboarding calls for newly activated merchants
- Annual account reviews for the top 20% by revenue

### 6.3 Processor Statement Calendar
- Monthly residual statement expected-receipt dates per processor (First Data typically pays by the 15th of the following month; TSYS and Worldpay vary)
- Reconciliation deadline reminders (e.g., flag disputes with the processor within 30 days of statement)

### 6.4 Implementation Note
A lightweight calendar implementation using a third-party React calendar component (react-big-calendar or FullCalendar) is sufficient. Events should be auto-generated from database triggers:
- PCI expiry → auto-create calendar event 60 days before expiry
- Merchant activation at T+30 → auto-create review event
- Residual statement receipt expected → auto-create reconciliation reminder

---

## 7. AI Assistant Use Cases Specific to ISO Operations

The AI assistant built into the portal (if implemented) has clear, high-value applications in ISO operations that are more concrete than general business AI.

### 7.1 Residual Statement Analysis
**Prompt pattern:** "Upload this month's TSYS residual statement. Identify any merchants where the residual has dropped more than 15% compared to last month, and any merchants not present last month."

**Value:** This is currently done manually by reconciling PDFs and spreadsheets. An AI that can parse a residual statement, compare against the prior month, and surface anomalies in seconds replaces 2–4 hours of manual work per processor per month.

### 7.2 At-Risk Merchant Detection
**Prompt pattern:** Continuously analyze the portfolio and flag merchants where: (a) volume has declined 3 consecutive months, (b) chargeback rate is trending upward, (c) no transactions processed in 7+ days.

**Value:** Early warning allows the ISO to engage merchants before they close or transfer to a competitor. Each saved merchant is worth the lifetime residual value (LTV) of their account.

### 7.3 Chargeback Reason Code Analysis
**Prompt pattern:** "Analyze our top 5 chargeback reason codes this month. What industries are most affected? What remediation guidance applies?"

**Value:** Visa and Mastercard publish specific remediation requirements per reason code. An AI that maps reason codes to actionable guidance helps the ISO advise merchants on fraud prevention and reduces repeat chargebacks.

### 7.4 Underwriting Pre-Screen
**Prompt pattern:** "Review this merchant application. Flag any KYC/AML risk factors: high-risk MCC, unusual business type for stated volume, mismatch between stated business age and processing history, MATCH list indicators."

**Value:** Pre-screens reduce the number of applications sent to the processor for formal underwriting that will be declined. A higher approval rate means better processor relationships and lower acquisition cost.

### 7.5 Partner Commission Dispute Resolution
**Prompt pattern:** "Partner X is disputing their June residual payout. Their schedule A says 20 bps split. Show me the calculation for each of their merchants this month."

**Value:** Commission disputes are a recurring administrative cost. An AI that can reconstruct the calculation from Schedule A terms and transaction data eliminates the need for manual spreadsheet auditing.

### 7.6 Portfolio Narrative Report (Monthly)
**Prompt pattern:** "Generate the June portfolio summary for the board: top 5 merchants by volume, volume vs. prior month, residual variance, chargeback trend, activations vs. attrition, and notable risk items."

**Value:** The monthly portfolio review is a standard ISO management task. An AI-generated first draft that the user can review and edit saves 1–2 hours per month.

---

## 8. Tools the Industry Uses (for Integration Context)

| Tool | Category | Relevance to Portal |
|---|---|---|
| IRIS CRM / Merchant Central (NMI) | Full ISO CRM | Benchmark — this is the category leader. Features = industry standard |
| ISOhub | ISO CRM | Strong residuals + pipeline features; good mobile UX |
| Pulse CRM | Merchant lifecycle | End-to-end: lead → processing → residuals in one tool |
| MidMetrics | Chargeback software | Dedicated chargeback monitoring with Verifi/Ethoca prevention alerts |
| Commissionly | Commission management | Sub-ISO and agent commission split automation |
| Chargebacks911 | Dispute resolution | Enterprise chargeback representment; integration point for dispute outcomes |
| DocuSign / HelloSign | E-signature | MPA signature workflow — already signaled in alerts panel |
| First Data/Fiserv, TSYS, Worldpay | Processor portals | Residual statement source — import integration target |

---

## 9. What AYC Patterns Map Well (Reuse Recommendations)

| AYC Feature | ISO Equivalent | Reuse Assessment |
|---|---|---|
| Monthly cashflow monitoring | Residual revenue tracking | Direct mapping — high confidence reuse |
| Expense tracking | SaaS, legal, marketing, travel costs | Direct mapping — adapt category labels |
| Client pipeline Kanban | Merchant onboarding pipeline | Direct mapping — stage names change |
| Email CRM follow-up | Proposal and agreement follow-up | Direct mapping |
| Calendar | Compliance review + partner meeting calendar | Direct mapping with new event types |
| Activity log | Audit trail for compliance | Direct mapping — required for regulatory |
| Commission tracking | Sub-ISO / AE commission splits | Direct mapping — existing CommissionsTable |
| KPI card grid | ISO KPI grid (volume, residual, chargeback) | Direct mapping — already implemented |
| Alerts panel | Risk and compliance action items | Direct mapping — already implemented |
| Charts module | Residual trend, volume trend, MCC distribution | Direct mapping — add MCC chart |

---

## 10. Summary Prioritization for Design Team

**Build now (Phase 1 / critical path):**
1. Per-merchant chargeback ratio column in MerchantsBoard
2. Dedicated Chargeback Tracker / Dispute Queue page (/admin/chargebacks)
3. Per-merchant BPS column in ResidualsTable
4. Attrition tracking in Residuals module
5. MCC field on merchant records

**Build next (Phase 2):**
6. Residual statement import with reconciliation comparison
7. Underwriting queue with document management and approval rate funnel
8. Portfolio attrition report with reason codes
9. Compliance calendar (PCI expiry, 90-day reviews)
10. Partner Schedule A commission calculation from residuals

**Build later (Phase 3):**
11. MCC risk heat map / donut chart
12. AI assistant for residual statement analysis
13. Merchant 30-day activation review auto-queue
14. Rate review queue
15. Mobile-friendly agent view

---

*Sources consulted: IRIS CRM / Merchant Central (NMI) feature documentation; ISOhub product pages; MidMetrics chargeback ISO platform; Visa VAMP program documentation (2025); Mastercard BRAM/QMAP program documentation; Commissionly ISO commission automation; Velocity Funding residual income analysis; Payzli real-time residual platform; Chargebacks911 chargeback management guide; Ramp merchant underwriting guide; Austreme MCC monitoring; LegitScript MCC compliance; StackedCRM competitive analysis.*
