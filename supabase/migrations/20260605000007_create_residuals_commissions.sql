-- Migration: 20260605000007_create_residuals_commissions.sql
-- Purpose: Monthly residual income entries and agent commission records

-- Residuals: monthly income per merchant
CREATE TABLE IF NOT EXISTS residuals (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id             uuid NOT NULL REFERENCES merchants (id) ON DELETE CASCADE,
  period_month            text NOT NULL,              -- format: YYYY-MM  e.g. '2026-05'
  account_type            account_type NOT NULL DEFAULT 'card_present',
  processing_volume_cents bigint NOT NULL DEFAULT 0,  -- total volume processed that month
  residual_rate_pct       numeric(6, 4) NOT NULL,     -- rate earned on volume e.g. 0.0025
  residual_amount_cents   bigint NOT NULL DEFAULT 0,  -- computed: volume * rate
  status                  residual_status NOT NULL DEFAULT 'pending',
  payout_date             date,
  created_at              timestamptz NOT NULL DEFAULT now(),

  -- Prevent duplicate entries for same merchant + month
  UNIQUE (merchant_id, period_month)
);

-- Commissions: per-agent splits derived from residuals
CREATE TABLE IF NOT EXISTS commissions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name              text NOT NULL,
  agent_role              agent_role NOT NULL DEFAULT 'ae',
  merchant_id             uuid NOT NULL REFERENCES merchants (id) ON DELETE CASCADE,
  period_month            text NOT NULL,              -- format: YYYY-MM
  base_split_pct          numeric(5, 4) NOT NULL DEFAULT 0.0000,    -- agent's share of residual
  residual_split_pct      numeric(5, 4) NOT NULL DEFAULT 0.0000,    -- additional residual split
  partner_split_pct       numeric(5, 4) NOT NULL DEFAULT 0.0000,    -- partner's share
  residual_amount_cents   bigint NOT NULL DEFAULT 0,
  agent_commission_cents  bigint NOT NULL DEFAULT 0,
  partner_commission_cents bigint NOT NULL DEFAULT 0,
  created_at              timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE residuals   ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "residuals_all_access" ON residuals
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "commissions_all_access" ON commissions
  FOR ALL
  USING (true)
  WITH CHECK (true);
