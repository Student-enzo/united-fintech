-- ============================================================
-- Onboarding CRM Migration
-- Created: 2026-06-05
-- ============================================================

-- ============================================================
-- TABLE 1: onboarding_applications
-- ============================================================
create table if not exists onboarding_applications (
  id                            uuid primary key default gen_random_uuid(),
  intake_token                  text unique not null default gen_random_uuid()::text,

  -- Business info
  business_name                 text,
  owner_name                    text,
  owner_email                   text not null,
  owner_phone                   text,
  business_type                 text check (business_type in ('LLC', 'Corp', 'Sole_Proprietor', 'Partnership')),
  ein                           text,
  website                       text,
  mcc                           text,
  monthly_volume                text,
  avg_ticket                    text,
  card_present_percent          text,
  years_in_business             text,

  -- Addresses
  business_address              text,
  city                          text,
  state                         text,
  zip                           text,
  owner_address                 text,
  owner_city                    text,
  owner_state                   text,
  owner_zip                     text,

  -- Owner KYC
  owner_dob                     text,
  owner_ssn_last4               text,
  ownership_percent             text,

  -- Processing history
  current_processor             text,
  chargeback_history            text default 'none',

  -- Co-owners (array of objects)
  co_owners                     jsonb default '[]',

  -- Risk & phase
  risk_tier                     text default 'unscored' check (risk_tier in ('unscored', 'low', 'medium', 'high', 'very_high')),
  current_phase                 text default 'intake_sent' check (current_phase in (
                                  'intake_sent', 'document_review', 'partner_selection',
                                  'pursuit', 'live', 'declined'
                                )),
  link_status                   text default 'sent' check (link_status in ('sent', 'opened', 'submitted')),

  -- AI fields
  ai_summary                    text,
  ai_risk_reasoning             text,
  ai_preapproval_recommendation text,
  ai_risk_score                 integer check (ai_risk_score >= 0 and ai_risk_score <= 100),
  website_compliance            jsonb,     -- {"has_terms": bool, "has_privacy": bool, "has_refund": bool}
  match_list_checked            boolean default false,

  -- Client portal
  portal_email                  text,
  client_auth_user_id           uuid,

  -- Duplicate detection
  duplicate_of                  uuid references onboarding_applications(id),

  -- Timestamps
  intake_token_expires_at       timestamptz default (now() + interval '30 days'),
  created_at                    timestamptz default now(),
  intake_submitted_at           timestamptz,
  preapproved_at                timestamptz,
  live_at                       timestamptz,
  created_by                    text
);

alter table onboarding_applications disable row level security;

-- ============================================================
-- TABLE 2: onboarding_documents
-- ============================================================
create table if not exists onboarding_documents (
  id               uuid primary key default gen_random_uuid(),
  application_id   uuid not null references onboarding_applications(id) on delete cascade,

  doc_type         text not null,
  doc_label        text,
  file_url         text,
  file_name        text,
  file_size_bytes  bigint,

  status           text default 'pending' check (status in ('pending', 'accepted', 'rejected', 're_upload_requested')),

  -- AI analysis
  ai_analysis      text,
  ai_flags         jsonb default '{}',  -- {"suspicious": bool, "stale": bool, "misclassified": bool, "suggested_type": text, "extracted_date": text, "extracted_data": {}}

  notes            text,
  reviewed_by      text,
  reviewed_at      timestamptz,

  uploaded_at      timestamptz default now(),
  is_client_visible boolean default true
);

alter table onboarding_documents disable row level security;

-- ============================================================
-- TABLE 3: onboarding_notes
-- ============================================================
create table if not exists onboarding_notes (
  id               uuid primary key default gen_random_uuid(),
  application_id   uuid not null references onboarding_applications(id) on delete cascade,
  document_id      uuid references onboarding_documents(id) on delete set null,

  content          text not null,
  created_by       text default 'admin',
  is_ai_generated  boolean default false,
  is_client_visible boolean default false,

  created_at       timestamptz default now()
);

alter table onboarding_notes disable row level security;

-- ============================================================
-- TABLE 4: partner_directory
-- ============================================================
create table if not exists partner_directory (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  type             text not null check (type in ('bank', 'processor', 'gateway')),
  risk_appetite    text default 'medium' check (risk_appetite in ('low', 'medium', 'high')),

  accepted_mcc_codes text[] default '{}',
  training_notes   text,

  contact_email    text,
  contact_name     text,
  logo_url         text,
  is_active        boolean default true,

  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table partner_directory disable row level security;

-- ============================================================
-- TABLE 5: onboarding_pursuits
-- ============================================================
create table if not exists onboarding_pursuits (
  id                        uuid primary key default gen_random_uuid(),
  application_id            uuid not null references onboarding_applications(id) on delete cascade,
  partner_id                uuid references partner_directory(id),
  partner_name              text not null,

  current_stage             text default 'not_submitted' check (current_stage in (
                              'not_submitted', 'submitted', 'initial_review',
                              'underwriting', 'conditionally_approved', 'approved', 'declined'
                            )),
  outcome                   text check (outcome in (null, 'approved', 'declined', 'conditional')),
  conditions                text,
  condition_review_date     timestamptz,

  ai_match_score            integer,
  ai_match_reasoning        text,

  underwriting_sla_deadline timestamptz,

  started_at                timestamptz default now(),
  resolved_at               timestamptz,
  notes                     text
);

alter table onboarding_pursuits disable row level security;

-- ============================================================
-- TABLE 6: pursuit_stage_log
-- ============================================================
create table if not exists pursuit_stage_log (
  id          uuid primary key default gen_random_uuid(),
  pursuit_id  uuid not null references onboarding_pursuits(id) on delete cascade,

  stage       text not null,
  notes       text,
  changed_by  text default 'admin',
  changed_at  timestamptz default now()
);

alter table pursuit_stage_log disable row level security;

-- ============================================================
-- TABLE 7: pursuit_document_requests
-- ============================================================
create table if not exists pursuit_document_requests (
  id              uuid primary key default gen_random_uuid(),
  pursuit_id      uuid not null references onboarding_pursuits(id) on delete cascade,
  application_id  uuid not null references onboarding_applications(id) on delete cascade,

  document_name   text not null,
  reason          text,
  status          text default 'pending' check (status in ('pending', 'fulfilled', 'cancelled')),

  requested_at    timestamptz default now(),
  fulfilled_at    timestamptz,
  deadline_at     timestamptz default (now() + interval '5 days')
);

alter table pursuit_document_requests disable row level security;

-- ============================================================
-- TABLE 8: onboarding_emails
-- ============================================================
create table if not exists onboarding_emails (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references onboarding_applications(id) on delete cascade,
  pursuit_id      uuid references onboarding_pursuits(id) on delete set null,

  email_type      text not null check (email_type in (
                    'intake_link', 'acknowledgment', 're_upload_request',
                    'representation_agreement', 'partner_update', 'submission_confirm',
                    'underwriting_update', 'doc_request', 'conditional_approval',
                    'approved', 'declined', 'client_live'
                  )),
  subject         text not null,
  body            text not null,
  to_email        text,
  status          text default 'draft' check (status in ('draft', 'sent')),

  created_at      timestamptz default now(),
  sent_at         timestamptz
);

alter table onboarding_emails disable row level security;

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_oa_owner_email      on onboarding_applications(owner_email);
create index if not exists idx_oa_ein              on onboarding_applications(ein);
create index if not exists idx_oa_current_phase    on onboarding_applications(current_phase);
create index if not exists idx_oa_intake_token     on onboarding_applications(intake_token);
create index if not exists idx_od_application_id   on onboarding_documents(application_id);
create index if not exists idx_on_application_id   on onboarding_notes(application_id);
create index if not exists idx_op_application_id   on onboarding_pursuits(application_id);
create index if not exists idx_op_partner_id       on onboarding_pursuits(partner_id);
create index if not exists idx_psl_pursuit_id      on pursuit_stage_log(pursuit_id);
create index if not exists idx_pdr_pursuit_id      on pursuit_document_requests(pursuit_id);
create index if not exists idx_oe_application_id   on onboarding_emails(application_id);

-- ============================================================
-- SEED: partner_directory
-- ============================================================
insert into partner_directory (name, type, risk_appetite, training_notes, contact_email, is_active) values
(
  'Chase Paymentech',
  'bank',
  'low',
  'Ideal for established retail and restaurants, minimum 2 years in business, strict on chargebacks above 0.5%, requires 6 months bank statements',
  'iso@chasepaymentech.com',
  true
),
(
  'Global Payments',
  'processor',
  'medium',
  'Good for e-commerce and SaaS, accepts subscription models, typically requires rolling reserve for merchants under 1 year old',
  'iso@globalpayments.com',
  true
),
(
  'Paya',
  'processor',
  'medium',
  'Strong in healthcare and professional services, fast approval for licensed businesses, chargeback tolerance up to 0.8%',
  'iso@paya.com',
  true
),
(
  'EMB - Easy Merchant Business',
  'processor',
  'high',
  'Specializes in high-risk: supplements, CBD, adult, travel. Requires 20-30% rolling reserve, enhanced KYC. Good approval rate for properly documented high-risk merchants',
  'iso@emb.com',
  true
),
(
  'Durango Merchant Services',
  'processor',
  'high',
  'High-risk specialist. Accepts CBD, firearms accessories, debt consolidation. Needs comprehensive processing history. Typical reserve 25%',
  'iso@durangomerchantservices.com',
  true
);
