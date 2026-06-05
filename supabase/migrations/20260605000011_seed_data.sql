-- Migration: 20260605000011_seed_data.sql
-- Purpose: Seed data matching mock data from admin portal components
-- Counts: 3 users, 7 partners, 12 merchants, 8 deals, 10 agreements,
--         10 residuals, 18 commissions, 10 compliance_records,
--         10 activity_log, 8 expenses, 6 settings rows

-- ─── Disable sequence reuse warnings ──────────────────────────────────────────
-- We insert deals/agreements with explicit deal_number/agreement_number values,
-- so advance the sequences past our manual inserts to avoid future collisions.

-- ─── 1. USERS ─────────────────────────────────────────────────────────────────
-- 3 rows
INSERT INTO users (id, email, full_name, role, is_active, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@unitedfintech.com',    'Admin User',     'admin',          true, '2024-01-01 08:00:00+00'),
  ('00000000-0000-0000-0000-000000000002', 'marcus.webb@unitedfintech.com',  'Marcus Webb',    'ae',         true, '2024-01-15 09:00:00+00'),
  ('00000000-0000-0000-0000-000000000003', 'sofia.andrade@unitedfintech.com','Sofia Andrade', 'partner_manager', true, '2024-02-01 09:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- ─── 2. PARTNERS ─────────────────────────────────────────────────────────────
-- 7 rows
INSERT INTO partners (id, name, iso_type, email, phone, commission_rate_pct, status, joined_at, notes) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Apex Payment Solutions',       'iso',     'apex@payments.com',    '+1 (305) 555-0101', 0.0120, 'active',    '2023-03-15', 'Top performer — hospitality and retail focus'),
  ('10000000-0000-0000-0000-000000000002', 'BlueStar Merchant Services',   'iso',     'partners@bluestar.io', '+1 (212) 555-0202', 0.0110, 'active',    '2023-06-01', 'E-commerce and SaaS verticals'),
  ('10000000-0000-0000-0000-000000000003', 'Coastal ISO Group',            'sub_iso', 'coastal@iso.net',      '+1 (786) 555-0303', 0.0090, 'active',    '2023-09-20', NULL),
  ('10000000-0000-0000-0000-000000000004', 'Prime Agent Network',          'agent',   'prime@agentnet.com',   '+1 (646) 555-0404', 0.0075, 'active',    '2024-01-10', NULL),
  ('10000000-0000-0000-0000-000000000005', 'Meridian Processing Partners', 'sub_iso', 'meridian@process.co',  '+1 (617) 555-0505', 0.0100, 'pending',   '2024-05-18', 'Onboarding — awaiting agreement execution'),
  ('10000000-0000-0000-0000-000000000006', 'Vanguard ISO Solutions',       'iso',     'vanguard@iso.com',     '+1 (310) 555-0606', 0.0115, 'suspended', '2023-01-05', 'Suspended pending compliance review — fee dispute'),
  ('10000000-0000-0000-0000-000000000007', 'Harbor Point Agents',          'agent',   'harbor@points.net',    '+1 (404) 555-0707', 0.0080, 'active',    '2024-02-28', NULL)
ON CONFLICT (id) DO NOTHING;

-- ─── 3. MERCHANTS ─────────────────────────────────────────────────────────────
-- 12 rows — sourced from MerchantsBoard.tsx MOCK_MERCHANTS
INSERT INTO merchants (
  id, business_name, dba_name, mcc_code, mcc_label, legal_structure,
  account_type, monthly_volume_est, avg_ticket, card_present_pct,
  contact_name, contact_email, contact_phone,
  pipeline_stage, assigned_partner_id, assigned_ae, risk_level
) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Suncoast Retail Group',       'Suncoast Shops',    '5411', 'Grocery Stores',                      'llc',         'card_present', 38500000,  6200,  94, 'James Harrington',  'james@suncoastretail.com',    '+1 (813) 555-0142', 'merchant_live',     '10000000-0000-0000-0000-000000000001', 'Marcus Webb',   'low'),
  ('20000000-0000-0000-0000-000000000002', 'BluePeak eCommerce LLC',      'BluePeak Store',    '5999', 'Retail Stores, NEC',                  'llc',         'ecommerce',    21000000, 12800,   0, 'Sofia Chen',        'sofia@bluepeak.io',           '+1 (305) 555-0209', 'account_activated', '10000000-0000-0000-0000-000000000002', 'Priya Nair',    'low'),
  ('20000000-0000-0000-0000-000000000003', 'Atlas Medical Supplies',      NULL,                '5047', 'Medical & Hospital Equipment',        'corporation', 'moto',          9500000, 31000,  10, 'Dr. Marcus Webb',   'marcus@atlasmedical.com',     '+1 (407) 555-0317', 'underwriting',      '10000000-0000-0000-0000-000000000003', 'Jordan Reyes',  'medium'),
  ('20000000-0000-0000-0000-000000000004', 'NovaBrew Coffee Co.',         'NovaBrew',          '5812', 'Eating Places & Restaurants',         's_corp',      'card_present',  5200000,  1800,  98, 'Priya Nair',        'priya@novabrew.co',           '+1 (786) 555-0421', 'setup_fee_paid',    '10000000-0000-0000-0000-000000000001', 'Marcus Webb',   'low'),
  ('20000000-0000-0000-0000-000000000005', 'PrimeAuto Finance',           NULL,                '5511', 'Auto Dealers - New & Used',           'llc',         'card_present', 72000000,420000,  75, 'Derek Huang',       'derek@primeauto.com',         '+1 (949) 555-0512', 'agreement_signed',  '10000000-0000-0000-0000-000000000007', 'Derek Huang',   'medium'),
  ('20000000-0000-0000-0000-000000000006', 'ClearView Law Group',         NULL,                '8111', 'Legal Services',                      'partnership', 'moto',          6800000, 85000,   5, 'Rachel Torres',     'rachel@clearviewlaw.com',     '+1 (212) 555-0618', 'agreement_sent',    '10000000-0000-0000-0000-000000000002', 'Priya Nair',    'low'),
  ('20000000-0000-0000-0000-000000000007', 'Apex Fitness Studios',        'Apex Fit',          '7997', 'Membership Sports & Recreation Clubs','llc',         'card_present',  4100000,  5500,  88, 'Leila Hassan',      'leila@apexfit.com',           '+1 (702) 555-0743', 'proposal_sent',     '10000000-0000-0000-0000-000000000001', 'Leila Hassan',  'low'),
  ('20000000-0000-0000-0000-000000000008', 'OceanTech Imports',           NULL,                '5065', 'Electrical Parts & Equipment',        'corporation', 'ecommerce',    15500000, 24000,   0, 'Kevin Park',        'kevin@oceantechimports.com',  '+1 (310) 555-0824', 'lead_identified',   '10000000-0000-0000-0000-000000000007', 'Derek Huang',   'medium'),
  ('20000000-0000-0000-0000-000000000009', 'Harborside Hospitality',      'Harborside Hotels', '7011', 'Hotels & Motels',                     'llc',         'card_present', 49000000, 19500,  82, 'Ana Whitfield',     'ana@harborsidehotels.com',    '+1 (305) 555-0935', 'merchant_live',     '10000000-0000-0000-0000-000000000002', 'Sofia Andrade', 'low'),
  ('20000000-0000-0000-0000-000000000010', 'RedLine Logistics Inc.',      NULL,                '4215', 'Courier Services',                    'corporation', 'ach',          32000000,110000,   0, 'Tom Brennan',       'tom@redlinelogistics.com',    '+1 (312) 555-1024', 'underwriting',      '10000000-0000-0000-0000-000000000003', 'Sofia Andrade', 'medium'),
  ('20000000-0000-0000-0000-000000000011', 'StarPath Education',          'StarPath Online',   '8299', 'Schools & Educational Services',      's_corp',      'ecommerce',     7800000, 29900,   0, 'Jordan Reyes',      'jordan@starpathedu.com',      '+1 (415) 555-1107', 'proposal_sent',     '10000000-0000-0000-0000-000000000001', 'Jordan Reyes',  'low'),
  ('20000000-0000-0000-0000-000000000012', 'TerraVerde Cannabis Dist.',   'TerraVerde',        '5912', 'Drug Stores & Pharmacies',            'llc',         'card_present', 16500000,  7200,  95, 'Marcus Webb',       'marcus@terraverdedist.com',   '+1 (720) 555-1212', 'declined',          '10000000-0000-0000-0000-000000000007', 'Marcus Webb',   'high')
ON CONFLICT (id) DO NOTHING;

-- ─── 4. DEALS ─────────────────────────────────────────────────────────────────
-- 8 rows — sourced from DealsTable.tsx MOCK_DEALS
INSERT INTO deals (
  id, merchant_id, deal_number, account_type, rate_model,
  proposed_rate_pct, proposed_fee_cents, monthly_volume_est, status, notes, created_at
) VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'UF-DEAL-0001', 'card_present', 'interchange_plus', 0.0020, 10, 8500000,  'accepted', 'High-volume retail — no chargeback history.',          '2026-03-12 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'UF-DEAL-0002', 'ecommerce',    'interchange_plus', 0.0030, 15, 22000000, 'sent',     NULL,                                                   '2026-04-01 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'UF-DEAL-0003', 'moto',         'flat_rate',        0.0250, 25,  4200000, 'viewed',   'Phone-order clinic — prefers simple flat model.',      '2026-04-15 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000005', 'UF-DEAL-0004', 'card_present', 'interchange_plus', 0.0015,  8, 31000000, 'draft',    NULL,                                                   '2026-05-02 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 'UF-DEAL-0005', 'ecommerce',    'interchange_plus', 0.0025, 12, 18000000, 'accepted', 'SaaS subscription model, avg ticket $149.',            '2026-05-10 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000009', 'UF-DEAL-0006', 'ach',          'flat_rate',        0.0075, 30, 49000000, 'declined', 'Risk review — excessive refund rate flagged.',         '2026-05-18 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000008', 'UF-DEAL-0007', 'ecommerce',    'interchange_plus', 0.0028, 14,  9700000, 'sent',     NULL,                                                   '2026-05-22 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000010', 'UF-DEAL-0008', 'card_present', 'interchange_plus', 0.0018,  9, 14500000, 'viewed',   NULL,                                                   '2026-05-29 10:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- Advance sequence past manual inserts
SELECT setval('deal_number_seq', 1008, true);

-- ─── 5. AGREEMENTS ────────────────────────────────────────────────────────────
-- 10 rows — sourced from AgreementsTable.tsx MOCK_AGREEMENTS
INSERT INTO agreements (
  id, merchant_id, agreement_number, account_type, rate_model,
  monthly_limit_cents, status, signed_at, effective_date, expiry_date, notes, created_at
) VALUES
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'MPA-0001', 'card_present', 'interchange_plus', 25000000,  'active',       now() - interval '180 days', (now() - interval '178 days')::date, (now() + interval '185 days')::date, NULL,                                                              now() - interval '185 days'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'MPA-0002', 'ecommerce',    'interchange_plus', 50000000,  'signed',       now() - interval '14 days',  (now() - interval '12 days')::date,  (now() + interval '351 days')::date, 'Awaiting bank verification to go active.',                        now() - interval '21 days'),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'MPA-0003', 'moto',         'flat_rate',        10000000,  'under_review', now() - interval '60 days',  (now() - interval '58 days')::date,  (now() + interval '305 days')::date, 'Chargeback rate exceeded 1% threshold — risk review.',            now() - interval '65 days'),
  ('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000005', 'MPA-0004', 'card_present', 'interchange_plus', 75000000,  'draft',        NULL,                        NULL,                                NULL,                                NULL,                                                              now() - interval '3 days'),
  ('40000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 'MPA-0005', 'ecommerce',    'interchange_plus', 40000000,  'active',       now() - interval '120 days', (now() - interval '118 days')::date, (now() + interval '45 days')::date,  'SaaS subscription merchant. Renewal due in 45 days.',            now() - interval '125 days'),
  ('40000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000009', 'MPA-0006', 'ach',          'flat_rate',        100000000, 'terminated',   now() - interval '400 days', (now() - interval '398 days')::date, (now() - interval '30 days')::date,  'Terminated due to excessive chargebacks.',                        now() - interval '410 days'),
  ('40000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000008', 'MPA-0007', 'ecommerce',    'interchange_plus', 30000000,  'sent',         NULL,                        NULL,                                NULL,                                NULL,                                                              now() - interval '7 days'),
  ('40000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000010', 'MPA-0008', 'card_present', 'interchange_plus', 60000000,  'active',       now() - interval '200 days', (now() - interval '198 days')::date, (now() + interval '55 days')::date,  NULL,                                                              now() - interval '205 days'),
  ('40000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000011', 'MPA-0009', 'ecommerce',    'interchange_plus', 18000000,  'expired',      now() - interval '400 days', (now() - interval '398 days')::date, (now() - interval '35 days')::date,  'Renewal not completed in time. Contact merchant.',                now() - interval '410 days'),
  ('40000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000006', 'MPA-0010', 'moto',         'flat_rate',         8000000,  'under_review', now() - interval '45 days',  (now() - interval '43 days')::date,  (now() + interval '320 days')::date, 'Flagged for high MOTO refund volume.',                            now() - interval '50 days')
ON CONFLICT (id) DO NOTHING;

-- Advance sequence past manual inserts
SELECT setval('agreement_number_seq', 1010, true);

-- ─── 6. RESIDUALS ─────────────────────────────────────────────────────────────
-- 10 rows — sourced from ResidualsTable.tsx MERCHANTS (period: 2026-05)
INSERT INTO residuals (
  id, merchant_id, period_month, account_type,
  processing_volume_cents, residual_rate_pct, residual_amount_cents, status, payout_date
) VALUES
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009', '2026-05', 'card_present', 48725000, 0.0028, 136500, 'paid',    '2026-05-15'),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '2026-05', 'ecommerce',    31280000, 0.0035, 109500, 'pending', NULL),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', '2026-05', 'card_present', 89200000, 0.0022, 196200, 'paid',    '2026-05-20'),
  ('50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000003', '2026-05', 'moto',         14560000, 0.0045,  65500, 'overdue', '2026-05-01'),
  ('50000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', '2026-05', 'card_present', 23410000, 0.0030,  70200, 'paid',    '2026-05-18'),
  ('50000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000001', '2026-05', 'ecommerce',    67890000, 0.0032, 217200, 'pending', NULL),
  ('50000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000006', '2026-05', 'moto',          9830000, 0.0042,  41300, 'paid',    '2026-05-22'),
  ('50000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000010', '2026-05', 'card_present',124000000, 0.0019, 235600, 'paid',    '2026-05-14'),
  ('50000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000007', '2026-05', 'card_present', 35670000, 0.0026,  92700, 'overdue', '2026-04-30'),
  ('50000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000008', '2026-05', 'ecommerce',    18940000, 0.0038,  72000, 'pending', NULL)
ON CONFLICT (merchant_id, period_month) DO NOTHING;

-- ─── 7. COMMISSIONS ───────────────────────────────────────────────────────────
-- 18 rows — sourced from CommissionsTable.tsx merchant breakdown for 2026-05
INSERT INTO commissions (
  id, agent_name, agent_role, merchant_id, period_month,
  base_split_pct, residual_split_pct, partner_split_pct,
  residual_amount_cents, agent_commission_cents, partner_commission_cents
) VALUES
  -- Marcus Webb (Senior AE, 55% base, 60% residual)
  ('60000000-0000-0000-0000-000000000001', 'Marcus Webb', 'senior_ae', '20000000-0000-0000-0000-000000000010', '2026-05', 0.5500, 0.6000, 0.1500, 235600, 141360, 35340),
  ('60000000-0000-0000-0000-000000000002', 'Marcus Webb', 'senior_ae', '20000000-0000-0000-0000-000000000005', '2026-05', 0.5500, 0.6000, 0.1500, 196200, 117720, 29430),
  ('60000000-0000-0000-0000-000000000003', 'Marcus Webb', 'senior_ae', '20000000-0000-0000-0000-000000000007', '2026-05', 0.5500, 0.6000, 0.1500,  92700,  55620, 13905),
  -- Priya Nair (AE, 45% base, 50% residual)
  ('60000000-0000-0000-0000-000000000004', 'Priya Nair',  'ae',        '20000000-0000-0000-0000-000000000001', '2026-05', 0.4500, 0.5000, 0.2000, 217200, 108600, 43440),
  ('60000000-0000-0000-0000-000000000005', 'Priya Nair',  'ae',        '20000000-0000-0000-0000-000000000002', '2026-05', 0.4500, 0.5000, 0.2000, 109500,  54750, 21900),
  ('60000000-0000-0000-0000-000000000006', 'Priya Nair',  'ae',        '20000000-0000-0000-0000-000000000008', '2026-05', 0.4500, 0.5000, 0.2000,  72000,  36000, 14400),
  -- Jordan Reyes (AE, 45% base, 50% residual)
  ('60000000-0000-0000-0000-000000000007', 'Jordan Reyes', 'ae',       '20000000-0000-0000-0000-000000000009', '2026-05', 0.4500, 0.5000, 0.2000, 136500,  68250, 27300),
  ('60000000-0000-0000-0000-000000000008', 'Jordan Reyes', 'ae',       '20000000-0000-0000-0000-000000000004', '2026-05', 0.4500, 0.5000, 0.2000,  70200,  35100, 14040),
  -- Sofia Andrade (Partner Manager, 35% base, 40% residual)
  ('60000000-0000-0000-0000-000000000009', 'Sofia Andrade', 'partner_manager', '20000000-0000-0000-0000-000000000003', '2026-05', 0.3500, 0.4000, 0.3000, 65500, 26200, 19650),
  ('60000000-0000-0000-0000-000000000010', 'Sofia Andrade', 'partner_manager', '20000000-0000-0000-0000-000000000006', '2026-05', 0.3500, 0.4000, 0.3000, 41300, 16520, 12390),
  ('60000000-0000-0000-0000-000000000011', 'Sofia Andrade', 'partner_manager', '20000000-0000-0000-0000-000000000005', '2026-05', 0.3500, 0.4000, 0.3000, 196200, 78480, 58860),
  -- Derek Huang (Senior AE, 55% base, 60% residual)
  ('60000000-0000-0000-0000-000000000012', 'Derek Huang', 'senior_ae', '20000000-0000-0000-0000-000000000010', '2026-05', 0.5500, 0.6000, 0.1500, 235600, 141360, 35340),
  ('60000000-0000-0000-0000-000000000013', 'Derek Huang', 'senior_ae', '20000000-0000-0000-0000-000000000001', '2026-05', 0.5500, 0.6000, 0.1500, 217200, 130320, 32580),
  -- Leila Hassan (AE, 45% base, 50% residual)
  ('60000000-0000-0000-0000-000000000014', 'Leila Hassan', 'ae',       '20000000-0000-0000-0000-000000000002', '2026-05', 0.4500, 0.5000, 0.2000, 109500, 54750, 21900),
  ('60000000-0000-0000-0000-000000000015', 'Leila Hassan', 'ae',       '20000000-0000-0000-0000-000000000008', '2026-05', 0.4500, 0.5000, 0.2000,  72000, 36000, 14400),
  -- Prior month sample rows (2026-04) for trend charts
  ('60000000-0000-0000-0000-000000000016', 'Marcus Webb',  'senior_ae', '20000000-0000-0000-0000-000000000010', '2026-04', 0.5500, 0.6000, 0.1500, 231000, 138600, 34650),
  ('60000000-0000-0000-0000-000000000017', 'Priya Nair',   'ae',        '20000000-0000-0000-0000-000000000001', '2026-04', 0.4500, 0.5000, 0.2000, 209000, 104500, 41800),
  ('60000000-0000-0000-0000-000000000018', 'Derek Huang',  'senior_ae', '20000000-0000-0000-0000-000000000010', '2026-04', 0.5500, 0.6000, 0.1500, 231000, 138600, 34650)
ON CONFLICT (id) DO NOTHING;

-- ─── 8. COMPLIANCE RECORDS ────────────────────────────────────────────────────
-- 10 rows — sourced from ComplianceBoard.tsx MOCK_MERCHANTS
INSERT INTO compliance_records (
  id, merchant_id, kyc_status, pci_status, risk_level,
  last_review_date, next_review_date,
  doc_business_license, doc_voided_check, doc_owner_id,
  doc_processing_statements, doc_pci_saq, flag_note
) VALUES
  ('70000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'verified', 'compliant',      'low',    '2025-03-15', '2026-03-15', true,  true,  true,  true,  true,  NULL),
  ('70000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 'verified', 'in_progress',    'medium', '2025-01-20', '2025-07-20', true,  true,  true,  true,  false, 'PCI SAQ overdue — clinic uses card storage'),
  ('70000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007', 'pending',  'in_progress',    'medium', '2025-04-01', '2025-10-01', true,  true,  false, true,  false, NULL),
  ('70000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'failed',   'non_compliant',  'high',   '2024-11-10', '2025-02-10', true,  false, false, false, false, 'FLAGGED: Multiple chargeback alerts, missing owner ID and bank docs. Escalate to compliance team.'),
  ('70000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 'verified', 'compliant',      'low',    '2025-02-28', '2026-02-28', true,  true,  true,  true,  true,  NULL),
  ('70000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000009', 'verified', 'compliant',      'low',    '2025-04-10', '2026-04-10', true,  true,  true,  true,  true,  NULL),
  ('70000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000011', 'pending',  'in_progress',    'medium', '2025-05-01', '2025-08-01', true,  true,  true,  false, false, 'Awaiting 3 months processing statements from previous processor'),
  ('70000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000010', 'failed',   'non_compliant',  'high',   '2024-09-05', '2025-03-05', false, false, false, false, false, 'FLAGGED: All documents missing. Possible shell entity — referred to AML review.'),
  ('70000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000006', 'verified', 'compliant',      'low',    '2025-03-22', '2026-03-22', true,  true,  true,  true,  true,  NULL),
  ('70000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000008', 'pending',  'in_progress',    'medium', '2025-05-15', '2025-08-15', true,  true,  false, true,  false, NULL)
ON CONFLICT (merchant_id) DO NOTHING;

-- ─── 9. ACTIVITY LOG ──────────────────────────────────────────────────────────
-- 10 rows — representative platform events
INSERT INTO activity_log (id, event_type, description, detail, user_name, created_at) VALUES
  ('80000000-0000-0000-0000-000000000001', 'merchant_activated', 'Merchant activated: Suncoast Retail Group',          'Pipeline moved to merchant_live',              'Marcus Webb',   now() - interval '42 days'),
  ('80000000-0000-0000-0000-000000000002', 'agreement_created',  'MPA-0001 created for Suncoast Retail Group',         'agreement_id: MPA-0001, status: active',        'Admin User',    now() - interval '185 days'),
  ('80000000-0000-0000-0000-000000000003', 'deal_sent',          'Deal UF-DEAL-0002 sent to BluePeak eCommerce LLC',   'deal_id: UF-DEAL-0002, volume: $220K',          'Priya Nair',    now() - interval '65 days'),
  ('80000000-0000-0000-0000-000000000004', 'partner_added',      'New partner onboarded: Meridian Processing Partners','iso_type: sub_iso, status: pending',            'Sofia Andrade', now() - interval '18 days'),
  ('80000000-0000-0000-0000-000000000005', 'commission_paid',    'Commissions posted for period 2026-04',              '6 agents paid, total $43,200',                  'Admin User',    now() - interval '21 days'),
  ('80000000-0000-0000-0000-000000000006', 'compliance_flagged', 'Compliance flag raised: Apex Digital Commerce',      'KYC failed, PCI non-compliant, high risk',      'Admin User',    now() - interval '30 days'),
  ('80000000-0000-0000-0000-000000000007', 'merchant_activated', 'Merchant activated: Harborside Hospitality',         'Pipeline moved to merchant_live',               'Sofia Andrade', now() - interval '88 days'),
  ('80000000-0000-0000-0000-000000000008', 'deal_sent',          'Deal UF-DEAL-0007 sent to OceanTech Imports',        'deal_id: UF-DEAL-0007, volume: $97K',           'Derek Huang',   now() - interval '14 days'),
  ('80000000-0000-0000-0000-000000000009', 'settings_changed',   'Commission split rates updated',                     'senior_ae base increased from 50% to 55%',      'Admin User',    now() - interval '60 days'),
  ('80000000-0000-0000-0000-000000000010', 'login',              'Admin login',                                         'ip: 192.168.1.1, device: macOS Safari',        'Admin User',    now() - interval '1 hour')
ON CONFLICT (id) DO NOTHING;

-- ─── 10. EXPENSES ─────────────────────────────────────────────────────────────
-- 8 rows — representative business expenses
INSERT INTO expenses (id, category, description, amount_cents, vendor, receipt_url, expense_date, logged_by) VALUES
  ('90000000-0000-0000-0000-000000000001', 'software',       'CRM subscription — June',                    49900,   'HubSpot',           NULL, '2026-06-01', 'Admin User'),
  ('90000000-0000-0000-0000-000000000002', 'software',       'E-signature platform — annual renewal',      59900,   'DocuSign',          NULL, '2026-05-15', 'Admin User'),
  ('90000000-0000-0000-0000-000000000003', 'travel',         'NYC partner summit — flights + hotel',      285000,  'Delta / Marriott',   NULL, '2026-05-20', 'Sofia Andrade'),
  ('90000000-0000-0000-0000-000000000004', 'marketing',      'Google Ads — May campaign',                 150000,  'Google LLC',         NULL, '2026-05-31', 'Admin User'),
  ('90000000-0000-0000-0000-000000000005', 'legal',          'MPA template revision — attorney fees',     400000,  'Greenberg Traurig',  NULL, '2026-04-10', 'Admin User'),
  ('90000000-0000-0000-0000-000000000006', 'entertainment',  'ISO partner dinner — Miami',                 38500,  'Zuma Miami',         NULL, '2026-05-22', 'Marcus Webb'),
  ('90000000-0000-0000-0000-000000000007', 'contractor',     'Backend API integration — freelance dev',   600000,  'Dev Contractor LLC', NULL, '2026-05-28', 'Admin User'),
  ('90000000-0000-0000-0000-000000000008', 'office',         'Desk accessories + printer supplies',        12500,  'Staples',            NULL, '2026-06-02', 'Admin User')
ON CONFLICT (id) DO NOTHING;

-- ─── 11. SETTINGS ─────────────────────────────────────────────────────────────
-- 6 rows — platform defaults
INSERT INTO settings (key, value) VALUES
  ('commission_splits',       '{"ae": {"base": 0.45, "residual": 0.50}, "senior_ae": {"base": 0.55, "residual": 0.60}, "partner_manager": {"base": 0.35, "residual": 0.40}}'::jsonb),
  ('deal_alert_threshold_days', '7'::jsonb),
  ('agreement_expiry_warn_days', '60'::jsonb),
  ('default_reserve_pct',     '0.05'::jsonb),
  ('risk_review_interval_days', '{"low": 365, "medium": 180, "high": 90}'::jsonb),
  ('brand',                   '{"primary": "#2BB8E6", "name": "United Fintech", "tagline": "Global Interchange"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
