-- Migration: 20260605000003_create_partners.sql
-- Purpose: ISO / referral partner records

CREATE TABLE IF NOT EXISTS partners (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  iso_type            iso_type NOT NULL DEFAULT 'agent',
  email               text,
  phone               text,
  commission_rate_pct numeric(5, 4) NOT NULL DEFAULT 0.0000,  -- e.g. 0.2500 = 25%
  status              partner_status NOT NULL DEFAULT 'pending',
  joined_at           date,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER set_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partners_all_access" ON partners
  FOR ALL
  USING (true)
  WITH CHECK (true);
