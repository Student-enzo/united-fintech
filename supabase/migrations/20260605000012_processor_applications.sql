-- Migration: 20260605000012_processor_applications.sql
-- Purpose: Add processor field to merchants + create applications table

-- 1. Processor field on merchants
ALTER TABLE merchants
  ADD COLUMN IF NOT EXISTS processor text,
  ADD COLUMN IF NOT EXISTS processor_submitted_at timestamptz;

COMMENT ON COLUMN merchants.processor IS 'Payment processor selected by ISO: Airwallex | Stripe | Helcim | NMI | PaymentCloud';

-- 2. Applications table — stores data submitted by the client via /apply/[id]
CREATE TABLE IF NOT EXISTS applications (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id         uuid NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

  -- Business info
  business_name       text,
  dba_name            text,
  legal_structure     text,
  mcc_code            text,
  website             text,
  business_address    text,
  city                text,
  state               text,
  zip                 text,
  phone               text,

  -- Owner info
  owner_name          text,
  owner_ssn_last4     text,
  owner_dob           text,
  ownership_percent   text,
  owner_address       text,
  owner_city          text,
  owner_state         text,
  owner_zip           text,

  -- Processing history
  current_processor   text,
  monthly_volume_est  bigint,         -- in cents
  avg_ticket          integer,        -- in cents
  card_present_pct    numeric(5,2),
  chargeback_rate     text,
  chargeback_history  text,

  -- Meta
  submitted_at        timestamptz NOT NULL DEFAULT now(),
  ip_address          text,

  CONSTRAINT one_active_application UNIQUE (merchant_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications_all_access" ON applications
  FOR ALL
  USING (true)
  WITH CHECK (true);
