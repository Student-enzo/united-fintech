-- Migration: 20260605000004_create_merchants.sql
-- Purpose: Core merchant table

CREATE TABLE IF NOT EXISTS merchants (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name       text NOT NULL,
  dba_name            text,
  mcc_code            text,                          -- 4-digit Merchant Category Code
  mcc_label           text,
  legal_structure     legal_structure,
  account_type        account_type NOT NULL DEFAULT 'card_present',
  monthly_volume_est  bigint,                        -- estimated monthly volume in cents
  avg_ticket          integer,                       -- average ticket in cents
  card_present_pct    numeric(5, 2),                 -- 0-100
  website             text,
  contact_name        text NOT NULL,
  contact_email       text,
  contact_phone       text,
  pipeline_stage      pipeline_stage NOT NULL DEFAULT 'lead_identified',
  assigned_partner_id uuid REFERENCES partners (id) ON DELETE SET NULL,
  assigned_ae         text,                          -- agent/AE name (denormalized for speed)
  risk_level          risk_level NOT NULL DEFAULT 'low',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER set_merchants_updated_at
  BEFORE UPDATE ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "merchants_all_access" ON merchants
  FOR ALL
  USING (true)
  WITH CHECK (true);
