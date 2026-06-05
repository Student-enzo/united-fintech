-- Migration: 20260605000005_create_deals.sql
-- Purpose: Rate proposals (deals) with auto-numbered deal_number

-- Sequence for UF-DEAL-XXXX
CREATE SEQUENCE IF NOT EXISTS deal_number_seq START 1001;

CREATE TABLE IF NOT EXISTS deals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id         uuid NOT NULL REFERENCES merchants (id) ON DELETE CASCADE,
  deal_number         text NOT NULL UNIQUE DEFAULT 'UF-DEAL-' || LPAD(nextval('deal_number_seq')::text, 4, '0'),
  account_type        account_type NOT NULL DEFAULT 'card_present',
  rate_model          rate_model NOT NULL DEFAULT 'interchange_plus',
  proposed_rate_pct   numeric(6, 4),                -- e.g. 0.0225 = 2.25%
  proposed_fee_cents  integer,                      -- per-transaction fee in cents
  monthly_volume_est  bigint,                       -- estimated monthly volume in cents
  avg_ticket          integer,                      -- average ticket in cents
  status              deal_status NOT NULL DEFAULT 'draft',
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER set_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deals_all_access" ON deals
  FOR ALL
  USING (true)
  WITH CHECK (true);
