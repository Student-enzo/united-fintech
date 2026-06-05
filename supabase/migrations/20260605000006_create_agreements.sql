-- Migration: 20260605000006_create_agreements.sql
-- Purpose: Merchant Processing Agreements (MPAs) with auto-numbered agreement_number

-- Sequence for MPA-XXXX
CREATE SEQUENCE IF NOT EXISTS agreement_number_seq START 1001;

CREATE TABLE IF NOT EXISTS agreements (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id         uuid NOT NULL REFERENCES merchants (id) ON DELETE CASCADE,
  agreement_number    text NOT NULL UNIQUE DEFAULT 'MPA-' || LPAD(nextval('agreement_number_seq')::text, 4, '0'),
  account_type        account_type NOT NULL DEFAULT 'card_present',
  rate_model          rate_model NOT NULL DEFAULT 'interchange_plus',
  monthly_limit_cents bigint,                        -- monthly processing cap in cents
  reserve_pct         numeric(5, 4),                 -- reserve percentage e.g. 0.1000 = 10%
  term_length         term_length NOT NULL DEFAULT '1yr',
  status              agreement_status NOT NULL DEFAULT 'draft',
  signed_at           timestamptz,
  effective_date      date,
  expiry_date         date,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER set_agreements_updated_at
  BEFORE UPDATE ON agreements
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agreements_all_access" ON agreements
  FOR ALL
  USING (true)
  WITH CHECK (true);
