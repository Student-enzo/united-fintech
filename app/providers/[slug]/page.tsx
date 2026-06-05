import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

type InsiderTip = { title: string; body: string }
type ProviderData = {
  name: string; logo: string; brandColor: string
  tagline: string; subtitle: string
  pros: string[]; cons: string[]
  insiderTips: InsiderTip[]
  whenToChoose: string; whenToAvoid: string; consultationHook: string
}

const PROVIDERS: Record<string, ProviderData> = {
  stripe: {
    name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com', brandColor: '#635BFF',
    tagline: 'The developer-first payments platform — and its hidden trade-offs.',
    subtitle: 'What high-volume merchants need to know before staying on standard rates.',
    pros: ['Best-in-class developer experience and documentation','Instant setup — live in minutes, no lengthy approval process','Excellent for SaaS, subscriptions, and marketplace models','Stripe Radar reduces fraud with machine learning included at base tier'],
    cons: ['Standard 2.9% + 30¢ hurts high-volume merchants — interchange-plus is rarely offered proactively','Account terminations happen with 24-hour notice and minimal explanation','Not suitable for high-risk verticals: supplements, firearms, adult, nutraceuticals','International payouts carry additional fees not prominently disclosed',"Custom pricing requires $1M+/year in volume — most merchants don't know to ask"],
    insiderTips: [
      { title: 'You can negotiate at $50K/month — most merchants never ask', body: "Once you're processing $50K/month, call Stripe directly and request custom rates. They'll typically offer 2.2% + 25¢ or better. Merchants on standard pricing at this volume are leaving $2,000–$4,000/month on the table." },
      { title: 'Radar is a baseline, not a fraud strategy', body: "Stripe monitors for a 0.4% dispute threshold before flagging your account. Radar helps but doesn't replace a proactive chargeback management workflow. Build your dispute response process from day one." },
      { title: 'Rolling reserves will lock your cash flow', body: "New merchants and anyone with a refund spike can face rolling 7-day reserves of 10–25% of volume. This cash sits in Stripe's hands. Understand your reserve terms before scaling marketing spend." },
      { title: 'A backup processor is not optional', body: "Stripe terminates accounts with 24-hour notice. If Stripe is your only processor, one dispute spike equals zero revenue. Every Stripe-primary merchant needs a backup merchant account configured and ready." },
    ],
    whenToChoose: 'Tech companies, SaaS, subscription services, developers building custom payment flows, marketplace models.',
    whenToAvoid: "High-risk industries, businesses needing net-30 settlement, companies with tight cash flow that can't absorb reserve holds.",
    consultationHook: "On Stripe's standard 2.9% rate? You're likely overpaying $1,500–$5,000/month. We negotiate custom interchange-plus rates and build backup processing strategies for Stripe-dependent businesses.",
  },
  paypal: {
    name: 'PayPal', logo: 'https://logo.clearbit.com/paypal.com', brandColor: '#003087',
    tagline: "The world's most recognized checkout button — with fees to match.",
    subtitle: "The trust signal your customers love. Here's how to use it without overpaying.",
    pros: ['Adds 2–3% conversion lift at checkout — buyers trust the PayPal badge','No monthly fees on standard accounts','PayPal Pay Later (BNPL) available natively with no integration work','Accepted in 200+ countries — strong international consumer trust'],
    cons: ['Standard rate of 3.49% + fixed fee is among the highest in the industry','Account freezes and fund holds are common for new or fast-growing merchants','Customer service is notoriously difficult — disputes drag for weeks',"PayPal's chargeback process heavily favors buyers — merchants lose the majority",'1.5–2% international transaction surcharge on top of base rates'],
    insiderTips: [
      { title: "PayPal is a checkout add-on, not your primary processor", body: "Never route more than 30% of your volume through PayPal. Use it as an alternative payment method for the trust lift, then accept cards through a lower-cost processor." },
      { title: "The 180-day hold window is real — plan for it", body: "PayPal can hold funds for up to 180 days after account limitation. Always run a secondary processor at sufficient volume so a PayPal freeze doesn't stop your business." },
      { title: "Braintree gives you PayPal's network at better terms", body: "Braintree (a PayPal company) offers lower fees, better account stability, and direct merchant account relationships. If PayPal volume is important, consolidate through Braintree." },
      { title: 'Document every transaction for dispute defense', body: "PayPal disputes take 10–45 days and require detailed evidence. Keep shipping confirmations, IP addresses, customer communications, and delivery proof for every order." },
    ],
    whenToChoose: "Consumer e-commerce where buyer trust is key, international markets, businesses needing BNPL without engineering overhead.",
    whenToAvoid: "High-volume merchants where fees compound, digital goods businesses, any merchant who can't sustain a hold on 25% of monthly volume.",
    consultationHook: "Most businesses using PayPal as a primary processor overpay by 0.8–1.5% of gross revenue. We build you a payment stack where PayPal works as a trust layer — not your main cost center.",
  },
  visa: {
    name: 'Visa', logo: 'https://logo.clearbit.com/visa.com', brandColor: '#1A1F71',
    tagline: "The world's largest card network — and the rules 90% of merchants have never read.",
    subtitle: 'Understanding Visa interchange categories alone can save thousands per month.',
    pros: ['Accepted in 200+ countries at 130M+ merchant locations worldwide','Wide product range from basic debit to Infinite Signature cards','3D Secure 2.0 shifts liability away from merchants for authenticated transactions','Visa Direct enables real-time push payments to cardholder accounts'],
    cons: ['Visa is a network, not a processor — your actual rates depend entirely on your acquirer','Interchange categories are complex — miscoding costs merchants 0.3–0.8% of volume','120-day dispute window gives cardholders significant leverage','Annual operating regulation updates require ongoing compliance review'],
    insiderTips: [
      { title: "You're being miscoded — it's costing you real money", body: "Most processors default merchants to the highest interchange category. The right MCC code plus proper transaction data can reduce Visa fees by 0.3–0.8% of volume. On $1M/year, that's $3,000–$8,000 annually." },
      { title: 'Level 2 & 3 data is free money for B2B merchants', body: "If you accept Visa corporate cards, sending Level 2/3 transaction data reduces interchange by up to 1%. Most merchants don't know this exists." },
      { title: 'The dispute threshold is 1% — manage toward 0.4%', body: "Visa's Merchant Monitoring Program activates at 1% dispute ratio. Above 0.5%, you start receiving inquiries. Above 1%, your account is at risk." },
      { title: 'Compelling Evidence 3.0 changes the dispute game', body: "Visa's CE 3.0 rules let merchants win fraud chargebacks by matching prior non-disputed purchase data: same IP, device fingerprint, shipping address." },
    ],
    whenToChoose: "All merchants should accept Visa. The question is which acquirer you use and whether they're optimizing interchange categories.",
    whenToAvoid: "There's no reason to avoid Visa. Focus energy on optimizing interchange categories and dispute workflows instead.",
    consultationHook: "We review your Visa interchange categories at no charge. Most merchants discover they're miscoded for $500–$5,000/month in avoidable fees.",
  },
  mastercard: {
    name: 'Mastercard', logo: 'https://logo.clearbit.com/mastercard.com', brandColor: '#EB001B',
    tagline: "The second-largest network with a premium cardholder base — and the fees to match.",
    subtitle: "World and World Elite interchange is higher. Here's how to manage it.",
    pros: ['200+ country acceptance, 90M+ merchant locations globally','World and World Elite cards signal high-value, high-spend customers','Mastercard Send enables real-time disbursements and B2B push payments','Identity Check (3DS2) shifts liability for authenticated CNP transactions'],
    cons: ['World Elite interchange runs 2.6% + $0.10 — significantly above standard cards','Complex rules across contactless, tokenized, and CNP transaction types',"Mastercard's Excessive Chargeback Program threshold is 1.5% — faster trigger than Visa",'Dispute response window is 45 days, requiring faster merchant action than Visa'],
    insiderTips: [
      { title: 'Premium cards cost you more — factor it into pricing', body: "When a customer pays with World or World Elite Mastercard, you pay 0.4–0.8% more in interchange. If your customer base skews affluent, your effective rate is higher than your blended rate suggests." },
      { title: 'Tokenized transactions qualify for better interchange rates', body: "Apple Pay, Google Pay, and other tokenized Mastercard transactions qualify for lower interchange. Merchants who push customers toward wallet payments see 0.1–0.2% lower rates." },
      { title: 'Transaction Query Retrieval prevents escalation', body: "Mastercard allows merchants to respond to retrieval requests before they become chargebacks. Building a retrieval response workflow prevents 40–60% of disputes from escalating." },
      { title: "The 45-day dispute clock is non-negotiable", body: "Mastercard's 45-day merchant response window is stricter than Visa's 30 days. Build your chargeback response workflow around the tighter timeline." },
    ],
    whenToChoose: "All merchants should accept Mastercard. Premium product lines benefit from Mastercard's affluent cardholder base.",
    whenToAvoid: "No reason to avoid Mastercard. Invest effort in World/World Elite interchange optimization and dispute response speed.",
    consultationHook: "We identify your Mastercard World vs. standard transaction split and build surcharging or cash discount programs to offset premium interchange without losing the sale.",
  },
  adyen: {
    name: 'Adyen', logo: 'https://logo.clearbit.com/adyen.com', brandColor: '#0ABF53',
    tagline: 'Enterprise payment infrastructure built for global scale — and what it really costs.',
    subtitle: "Powers McDonald's, Spotify, and Uber. The question is whether it's right for your volume.",
    pros: ['Single platform for online, in-store, and in-app payments across 35+ markets','Interchange-plus pricing — transparent and competitive at high volume','Native multi-currency settlement without third-party FX cost','Authorization rate optimization through machine learning and network tokens','No third-party gateway fees — fully integrated acquiring in key markets'],
    cons: ['$120/month minimum fee regardless of processing volume','Practical volume minimum is $1M+/year — below that, TCO exceeds alternatives','Implementation takes 2–6 months and requires dedicated developer resources','US-based customer support has documented latency issues','Platform and scheme fees are separate from processing margin — full TCO is complex'],
    insiderTips: [
      { title: "Adyen's real advantage is authorization rate, not fees", body: "Adyen's decline analytics and smart retry logic recover 2–4% of failed transactions. For large merchants, this revenue recovery often exceeds the savings from lower processing fees." },
      { title: 'Merchant-initiated transactions are where interchange savings hide', body: "Subscriptions and recurring charges through Adyen's MIT framework qualify for lower interchange. Most merchants don't configure this properly and overpay on every billing cycle." },
      { title: 'The $120/month minimum is just the entry point', body: "Full Adyen costs include processing margin (~0.3–0.6%), platform fees (€0.11–€0.17/transaction), and scheme fees. Build a full TCO model before comparing to Stripe or Checkout.com." },
      { title: "RevenueAccelerate is the highest-ROI feature most Adyen merchants haven't turned on", body: "Adyen's network tokenization and smart retry workflow recovers declined transactions automatically. Merchants who enable this see 1–3% authorization rate improvement with no additional integration work." },
    ],
    whenToChoose: "Enterprise companies processing $5M+/year, global brands needing unified omnichannel commerce, businesses where authorization rate optimization moves revenue.",
    whenToAvoid: "SMBs under $1M/year, startups needing rapid deployment, businesses that can't allocate a 2–6 month integration project.",
    consultationHook: "We help merchants evaluate whether Adyen's total cost of ownership is justified at their volume versus Stripe, Checkout.com, or a direct acquiring relationship.",
  },
  tipalti: {
    name: 'Tipalti', logo: 'https://logo.clearbit.com/tipalti.com', brandColor: '#0073CF',
    tagline: 'The AP automation platform that eliminates supplier payment overhead at scale.',
    subtitle: "Not a merchant processor — a payout powerhouse. Here's when it's worth it.",
    pros: ['Automates the entire accounts payable workflow end-to-end','Supports 196 countries and 120+ currencies with local payment methods','Built-in W-9, W-8BEN collection and 1099/FATCA reporting automation','Self-service supplier portal removes admin burden from your AP team','Strong compliance and OFAC/sanctions screening on every payment'],
    cons: ['Not a merchant processor — does not accept customer card payments','Custom pricing typically runs $1,000–$5,000/month base plus per-payment fees','Implementation complexity: plan 60–90 days for full deployment','Overkill for companies with fewer than 50 regular payees','Bank transfer and wire fees accumulate at high international volume'],
    insiderTips: [
      { title: 'ROI comes from FTE reduction, not payment fee savings', body: "Companies with 50+ payees see 50–70% reduction in AP team time. At 100+ payees, most eliminate 1–2 full-time positions. Build your ROI model around labor cost avoidance." },
      { title: 'Tax compliance alone often justifies the cost', body: "For US companies with international contractors, Tipalti's automated W-8BEN collection and 1099-NEC filing prevents IRS penalties that routinely exceed platform costs." },
      { title: 'Virtual card rebates can offset platform costs', body: "Tipalti's virtual card funding option generates 1–1.5% rebates on AP spend volume. For organizations with $5M+/year in supplier payments, this rebate can materially offset the platform cost." },
      { title: 'Multi-entity support is the hidden multiplier', body: "Companies with multiple legal entities get disproportionate value from Tipalti's multi-entity payment orchestration. Single-entity companies get good ROI — multi-entity companies get transformational ROI." },
    ],
    whenToChoose: "Companies with 50+ regular payees (suppliers, contractors, creators, affiliates), any company with international contractors needing automated tax compliance.",
    whenToAvoid: "B2C customer payment acceptance, companies with under 30 payees, businesses that need a simple card-present solution.",
    consultationHook: "We map your accounts payable workflow and build an ROI model comparing your current process against Tipalti — including AP overhead, payment errors, tax compliance risk, and FX costs.",
  },
  braintree: {
    name: 'Braintree', logo: 'https://logo.clearbit.com/braintreepayments.com', brandColor: '#009CDE',
    tagline: "PayPal's enterprise payments arm — better rates and stability than PayPal's standard product.",
    subtitle: "The under-leveraged option for merchants who want PayPal's network without PayPal's complexity.",
    pros: ['First $50K processed monthly at $0 — genuinely free tier for qualifying accounts','Access to PayPal, Venmo, and PayPal Pay Later within one SDK integration','Full card vaulting and subscription billing infrastructure included','Developer APIs comparable to Stripe for technical capabilities','Interchange-plus pricing available for qualifying volume'],
    cons: ['Owned by PayPal — subject to the same policy and account risk framework','Customer support quality consistently below Stripe','Product innovation pace trails Stripe and Adyen by 12–18 months','International acquiring capabilities are weaker than Adyen and Checkout.com','Venmo commerce features remain limited compared to standalone PayPal'],
    insiderTips: [
      { title: "The $0 first $50K/month is genuinely free — and underused", body: "Braintree's zero-fee first $50K/month is real and not prominently marketed. Early-stage companies save $1,200–$1,800/month versus Stripe's standard rate. Most founders don't know this exists." },
      { title: "Use Braintree for PayPal unification, not as a primary processor replacement", body: "The strongest Braintree use case is consolidating PayPal + Venmo + card acceptance into one integration. For merchants with meaningful PayPal checkout volume, this alone reduces complexity." },
      { title: 'Interchange-plus pricing requires a direct ask', body: "Braintree doesn't advertise interchange-plus publicly. Once you're at $100K+/month, contact your account manager directly and request it." },
      { title: 'Card vault data is portable — use it strategically', body: "Braintree offers one of the better card vault portability policies in the industry. Stored payment data can be migrated if you ever switch processors." },
    ],
    whenToChoose: "Marketplaces and platforms needing PayPal/Venmo, early-stage companies under $50K/month (free tier), businesses wanting Stripe-like technical capabilities plus PayPal network access.",
    whenToAvoid: "International-first businesses, merchants needing cutting-edge payment features, high-risk categories.",
    consultationHook: "Many Stripe merchants don't realize Braintree replicates 80% of Stripe's capabilities at lower cost with PayPal network access included. We model the exact cost difference for your volume.",
  },
  airwallex: {
    name: 'Airwallex', logo: 'https://logo.clearbit.com/airwallex.com', brandColor: '#1EA8D4',
    tagline: 'Multi-currency financial infrastructure that turns cross-border complexity into a cost advantage.',
    subtitle: "FX savings of 0.5–2% are real at the right volume. Here's the threshold.",
    pros: ['Multi-currency accounts in 60+ currencies at interbank FX rates','Up to 1–2% savings on FX versus banks, Stripe, or PayPal currency conversion','Global payment acceptance in 180+ countries','Embedded finance APIs for platforms building financial products','$0 international wire fees in many high-volume corridors'],
    cons: ['Newer platform — less merchant track record for complex or high-volume scenarios','Not recommended as sole payment processor for complex B2C e-commerce','US acquiring capabilities still maturing versus Stripe and Adyen','Customer support responsiveness varies by market and volume tier','Limited in-person POS payment support'],
    insiderTips: [
      { title: 'The FX arbitrage materializes at $500K+/year in international volume', body: "At $100K/month in cross-border transactions, Airwallex's interbank rates save $500–$2,000/month versus Stripe's 1.5% or PayPal's 2% currency conversion margin." },
      { title: 'Local currency accounts eliminate correspondent bank fees', body: "Airwallex's local accounts in 60+ countries eliminate $25–$50 per-transaction correspondent bank fees. For companies paying international contractors regularly, this compounds to $10,000–$50,000/year." },
      { title: 'Combine Airwallex with a US acquirer — not instead of one', body: "Most successful Airwallex deployments pair it with Stripe or Adyen for primary US card acceptance. Airwallex handles international collections and FX management." },
      { title: 'Virtual card issuing is emerging as the strongest use case', body: "Airwallex's virtual card program lets you deploy spend cards with real-time controls and multi-currency limits, replacing expensive procurement card workflows." },
    ],
    whenToChoose: "Companies with 20%+ international revenue, platforms building multi-currency products, businesses making frequent international supplier or contractor payments.",
    whenToAvoid: "Domestic-only US businesses, merchants needing robust POS payments, companies under $500K/year in international volume.",
    consultationHook: "We calculate your exact FX cost today — including hidden bank conversion margins and Stripe/PayPal surcharges — versus an Airwallex stack tailored to your specific payment corridors.",
  },
  fiserv: {
    name: 'Fiserv', logo: 'https://logo.clearbit.com/fiserv.com', brandColor: '#FF6600',
    tagline: 'The financial infrastructure giant behind more of your payments than you realize.',
    subtitle: 'Clover. First Data. Fiserv. All one company — and what that means for your contract terms.',
    pros: ['Largest US payment processor by volume — $2.5T+ processed annually','Clover POS hardware integration for omnichannel in-store merchants','Deep community bank relationships — merchant services for thousands of banks','Comprehensive B2B payment infrastructure and ACH processing','Strong enterprise features for large omnichannel retailers'],
    cons: ['Pricing is complex and opaque — multiple line items across statements','Standard contracts are 3 years with significant early termination fees','Clover hardware is leased by default — merchants pay 2–3x market value over contract','Customer service quality depends heavily on your specific relationship manager','Legacy technology across several product lines makes integration more difficult'],
    insiderTips: [
      { title: 'Never lease Clover hardware — ever', body: "Fiserv reps push 36–48 month hardware leases for equipment worth $600–$900 that costs $2,000–$4,000 over the lease term. Always buy hardware outright. Lease agreements have negligible exit options." },
      { title: 'Demand interchange-plus pricing in writing before signing', body: "Most Fiserv merchants are on tiered pricing that concentrates margin for the processor. Interchange-plus is available but requires explicit negotiation." },
      { title: 'Negotiate early termination fees to $0 before you sign', body: "Standard contracts include $500–$2,500 early termination fees. These are negotiable before signing and non-negotiable after." },
      { title: "First Data is Fiserv — know what entity you're dealing with", body: "First Data was acquired by Fiserv in 2019. If you have a First Data merchant agreement, Fiserv's renewal terms may differ. Check your auto-renewal date 6 months early." },
    ],
    whenToChoose: "Established brick-and-mortar retailers, businesses with existing bank relationships providing merchant services, enterprise companies needing comprehensive payment infrastructure.",
    whenToAvoid: "E-commerce businesses, startups, any merchant who values contract flexibility over established processing relationships.",
    consultationHook: "We audit Fiserv and Clover contracts to identify hardware lease overcharges, hidden fees, and renegotiation leverage. Most merchants we audit save $300–$1,500/month.",
  },
  square: {
    name: 'Square', logo: 'https://logo.clearbit.com/squareup.com', brandColor: '#3d3d3d',
    tagline: 'The merchant ecosystem that changed small business payments — and its volume ceiling.',
    subtitle: "Right below $500K/year. Above that, you're probably overpaying significantly.",
    pros: ['Flat 2.6% + 10¢ in-person — simple, predictable, no surprise line items','Free POS software with inventory, employee management, and reporting','Same-day deposits available for 1.5% (next-business-day free)','No monthly fees on basic plan — ideal for seasonal or early-stage merchants','Strong hardware ecosystem: Reader, Terminal, Register for every format'],
    cons: ['2.6% becomes expensive above $30–50K/month versus interchange-plus alternatives','Square is a payment facilitator — not a direct acquirer — less account stability','Account holds and terminations documented extensively in specific industries','Limited customization for complex payment flows or B2B scenarios','Vertical-specific paid plans ($60+/month) include features most merchants never use'],
    insiderTips: [
      { title: "The flat rate subsidizes low volume — above $50K/month, you're subsidizing Square", body: "Square's 2.6% flat rate is below true interchange cost for basic cards — they make margin on premium cards. Above $500K/year, switching to interchange-plus typically saves $3,000–$8,000 annually." },
      { title: "Square is a payment facilitator — understand what that means", body: "Square aggregates thousands of merchants under its master merchant ID. This enables fast onboarding but reduces your protection — Square can hold accounts faster than a traditional acquirer." },
      { title: 'Audit your Square subscription plan annually', body: "Square for Retail, Square for Restaurants, and vertical-specific plans cost $60–$165+/month. Most merchants on paid plans use fewer than 40% of included features." },
      { title: "The volume ceiling rule of thumb: $500K/year", body: "Under $500K/year, Square's simplicity justifies the premium rate. Above $500K, the savings from interchange-plus are typically $3,000–$8,000/year and compound as volume grows." },
    ],
    whenToChoose: "Small businesses under $500K/year, pop-ups and seasonal merchants, restaurants and retail wanting all-in-one POS with zero monthly fees.",
    whenToAvoid: "High-volume merchants ($500K+/year), businesses needing stable dedicated merchant accounts, complex B2B payment integration.",
    consultationHook: "We benchmark your Square fees against interchange-plus processing at your exact volume. Most merchants above $30K/month can save $200–$600/month with the right processor.",
  },
  worldpay: {
    name: 'Worldpay', logo: 'https://logo.clearbit.com/worldpay.com', brandColor: '#004B87',
    tagline: "One of the world's largest processors — and one of the most complex contracts to navigate.",
    subtitle: 'The questions you need answered before signing a Worldpay agreement.',
    pros: ['Processes 40+ billion transactions annually — scale and reliability are proven','Operates in 146 countries with broad international acquiring','Multiple acquiring relationships reduce authorization failure rates','Dedicated relationship management for enterprise accounts','Comprehensive fraud and risk management for high-volume merchants'],
    cons: ['Multi-year contracts (3–5 years) with liquidated damages clauses','Pricing structure has multiple fee lines — full cost requires detailed analysis','Service quality correlates strongly with relationship manager experience','API documentation and developer experience lags Stripe and Adyen significantly','Post-FIS divestiture, two separate Worldpay entities create contract confusion'],
    insiderTips: [
      { title: "Confirm which Worldpay entity you're contracting with", body: "After the FIS divestiture (completed 2023–2024), there are two distinct entities: Worldpay from FIS (enterprise) and the standalone Worldpay Inc. Their contract terms and support quality differ significantly." },
      { title: 'Liquidated damages can exceed six figures — read the termination clause', body: "Worldpay enterprise contracts include liquidated damages calculated on processing volume over the remaining contract term. A $2M/month merchant exiting 18 months early can face $500K+ in exit fees." },
      { title: 'Negotiate minimum authorization rate guarantees into your contract', body: "Enterprise merchants should negotiate minimum authorization rate guarantees (97%+) into the contract with penalties for underperformance. Most merchants don't ask for it." },
      { title: 'Quarterly business reviews are how you catch pricing creep', body: "Rate adjustments and new fee line items are common with long-term Worldpay contracts. Annual cost reviews with a payment consultant typically reveal 0.2–0.4% in compounding fee increases." },
    ],
    whenToChoose: "Large enterprises processing $10M+/year, companies needing multi-acquirer routing for high authorization rates, established international merchants.",
    whenToAvoid: "SMBs, startups, any merchant unwilling to commit to 3–5 year contracts or who needs the ability to switch processors in under 12 months.",
    consultationHook: "Before signing any Worldpay contract, we review termination clauses, pricing schedules, and SLA terms. Most merchants who don't negotiate these points spend $50,000–$500,000 more than they needed to.",
  },
  fis: {
    name: 'FIS', logo: 'https://logo.clearbit.com/fisglobal.com', brandColor: '#2D4E91',
    tagline: 'The banking technology giant behind financial infrastructure most merchants never see.',
    subtitle: "If your bank does merchant services, FIS is probably involved. Here's what that means.",
    pros: ['Largest global fintech provider — processes over $10T in volume annually','NYCE, Pulse, and Star PIN debit network ownership provides broad coverage','Strong B2B payment and ACH infrastructure for institutional clients','Established relationships with thousands of banks for integrated solutions','Enterprise-grade security and compliance across all product lines'],
    cons: ['Consumer-facing merchant processing (Worldpay) divested — direct FIS relationships are primarily institutional','Complex enterprise engagement — not suitable for self-service merchant onboarding','Pricing transparency is extremely low for direct merchant relationships','Technology modernization across legacy products has been inconsistent'],
    insiderTips: [
      { title: "Your bank's merchant services is probably FIS infrastructure", body: "If you have merchant services through a regional or community bank, the underlying infrastructure is frequently FIS. Understanding this gives you negotiating leverage at the bank level." },
      { title: 'FIS and Worldpay are separate companies since 2024', body: "The Worldpay divestiture completed in 2023–2024. Merchant processing through 'Worldpay' is now a standalone entity. Confirm which entity owns your merchant agreement." },
      { title: 'B2B ACH through FIS banking relationships is often lowest-cost', body: "For high-value B2B transactions, FIS's ACH infrastructure through bank relationships often provides lower total cost than card-based alternatives." },
      { title: 'Integration cost is the hidden variable in FIS economics', body: "FIS enterprise integrations take 6–18 months and require dedicated IT resources. The 'free' FIS relationship through your bank has real engineering costs." },
    ],
    whenToChoose: "Financial institutions, banks building payment infrastructure, large enterprises with existing FIS banking relationships.",
    whenToAvoid: "Direct card acceptance as a standalone merchant — use Worldpay (now separate) or another acquirer. FIS direct relationships are primarily institutional.",
    consultationHook: "We help companies untangle FIS, Worldpay, and bank relationships to build a payment stack that minimizes fees, integration complexity, and vendor dependency.",
  },
}

export async function generateStaticParams() {
  return Object.keys(PROVIDERS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = PROVIDERS[slug]
  if (!p) return { title: 'Provider Not Found' }
  return {
    title: `${p.name} Payment Processing — Insider Guide | United Fintech`,
    description: p.tagline,
  }
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = PROVIDERS[slug]
  if (!p) notFound()

  const glow = `radial-gradient(ellipse 60% 40% at 50% 0%, ${p.brandColor}22, transparent 70%)`

  return (
    <main style={{ backgroundColor: '#0E1118', minHeight: '100vh', color: '#E8EDF2', fontFamily: 'inherit' }}>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 0' }}>
        <Link href="/" style={{ color: '#1EA8D4', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to Partners
        </Link>
      </div>

      {/* Hero */}
      <section style={{ background: glow, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '3rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: `0 0 0 3px ${p.brandColor}44, 0 8px 32px rgba(0,0,0,0.4)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.logo} alt={p.name} width={52} height={52} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <p style={{ color: '#7E8794', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Provider Deep Dive</p>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#E8EDF2', margin: 0 }}>{p.name}</h1>
            </div>
          </div>
          <div style={{ borderLeft: `3px solid ${p.brandColor}`, paddingLeft: '1.25rem', maxWidth: 680, marginBottom: '0.75rem' }}>
            <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', fontWeight: 700, color: '#E8EDF2', margin: 0 }}>{p.tagline}</p>
          </div>
          <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 620, margin: 0 }}>{p.subtitle}</p>
        </div>
      </section>

      {/* Pros / Cons */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: '#141920', border: '1px solid rgba(30,168,212,0.2)', borderRadius: 16, padding: '1.75rem' }}>
            <h2 style={{ color: '#1EA8D4', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Genuine Strengths</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {p.pros.map((pro, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(30,168,212,0.15)', border: '1px solid rgba(30,168,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.65rem', color: '#1EA8D4', marginTop: 1 }}>✓</span>
                  <span style={{ color: '#C8D0DA', fontSize: '0.88rem', lineHeight: 1.6 }}>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#141920', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '1.75rem' }}>
            <h2 style={{ color: '#F87171', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Watch-Outs</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {p.cons.map((con, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.65rem', color: '#F87171', marginTop: 1 }}>✕</span>
                  <span style={{ color: '#C8D0DA', fontSize: '0.88rem', lineHeight: 1.6 }}>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Insider Tips */}
      <section style={{ background: '#0A0F16', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '3rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
          <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Insider Intelligence</p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#E8EDF2', marginBottom: '2rem' }}>What most merchants never find out.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {p.insiderTips.map((tip, i) => (
              <div key={i} style={{ background: '#141920', borderLeft: `3px solid ${p.brandColor}`, borderRadius: '0 12px 12px 0', padding: '1.5rem' }}>
                <p style={{ color: '#7E8794', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tip {String(i + 1).padStart(2, '0')}</p>
                <h3 style={{ color: '#E8EDF2', fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.4 }}>{tip.title}</h3>
                <p style={{ color: '#7E8794', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fit Assessment */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#E8EDF2', marginBottom: '1.5rem' }}>Is {p.name} right for you?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '1.5rem' }}>
            <p style={{ color: '#4ADE80', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Best For</p>
            <p style={{ color: '#C8D0DA', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{p.whenToChoose}</p>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '1.5rem' }}>
            <p style={{ color: '#F87171', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Not the Right Fit When</p>
            <p style={{ color: '#C8D0DA', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{p.whenToAvoid}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', background: 'linear-gradient(135deg, #141920, #0E1118)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 'clamp(2rem, 5vw, 3.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70%', height: 200, background: `radial-gradient(ellipse at 50% 0%, ${p.brandColor}18, transparent 70%)`, pointerEvents: 'none' }} />
          <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', position: 'relative' }}>Free Strategy Call</p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#E8EDF2', marginBottom: '1rem', position: 'relative' }}>
            Is {p.name} the right fit for your business?
          </h2>
          <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2rem', position: 'relative' }}>
            {p.consultationHook}
          </p>
          <Link href="/contact" style={{ display: 'inline-block', background: '#1EA8D4', color: '#0E1118', padding: '0.85rem 2.25rem', borderRadius: 9999, fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', position: 'relative' }}>
            Book a Free Strategy Call →
          </Link>
        </div>
      </section>

    </main>
  )
}
