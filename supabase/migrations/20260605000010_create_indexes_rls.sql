-- Migration: 20260605000010_create_indexes_rls.sql
-- Purpose: Performance indexes for all tables

-- ─── users ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email      ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role       ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_is_active  ON users (is_active);

-- ─── partners ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_partners_status   ON partners (status);
CREATE INDEX IF NOT EXISTS idx_partners_iso_type ON partners (iso_type);

-- ─── merchants ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_merchants_pipeline_stage     ON merchants (pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_merchants_assigned_partner   ON merchants (assigned_partner_id);
CREATE INDEX IF NOT EXISTS idx_merchants_assigned_ae        ON merchants (assigned_ae);
CREATE INDEX IF NOT EXISTS idx_merchants_risk_level         ON merchants (risk_level);
CREATE INDEX IF NOT EXISTS idx_merchants_account_type       ON merchants (account_type);
CREATE INDEX IF NOT EXISTS idx_merchants_created_at         ON merchants (created_at DESC);
-- Full-text search on business name
CREATE INDEX IF NOT EXISTS idx_merchants_business_name_trgm
  ON merchants USING GIN (business_name gin_trgm_ops);

-- ─── deals ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id  ON deals (merchant_id);
CREATE INDEX IF NOT EXISTS idx_deals_status       ON deals (status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at   ON deals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_deal_number  ON deals (deal_number);

-- ─── agreements ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_agreements_merchant_id        ON agreements (merchant_id);
CREATE INDEX IF NOT EXISTS idx_agreements_status             ON agreements (status);
CREATE INDEX IF NOT EXISTS idx_agreements_agreement_number   ON agreements (agreement_number);
CREATE INDEX IF NOT EXISTS idx_agreements_effective_date     ON agreements (effective_date);
CREATE INDEX IF NOT EXISTS idx_agreements_expiry_date        ON agreements (expiry_date);

-- ─── residuals ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_residuals_merchant_id   ON residuals (merchant_id);
CREATE INDEX IF NOT EXISTS idx_residuals_period_month  ON residuals (period_month DESC);
CREATE INDEX IF NOT EXISTS idx_residuals_status        ON residuals (status);

-- ─── commissions ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_commissions_merchant_id   ON commissions (merchant_id);
CREATE INDEX IF NOT EXISTS idx_commissions_period_month  ON commissions (period_month DESC);
CREATE INDEX IF NOT EXISTS idx_commissions_agent_name    ON commissions (agent_name);
CREATE INDEX IF NOT EXISTS idx_commissions_agent_role    ON commissions (agent_role);

-- ─── compliance_records ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_compliance_merchant_id     ON compliance_records (merchant_id);
CREATE INDEX IF NOT EXISTS idx_compliance_kyc_status      ON compliance_records (kyc_status);
CREATE INDEX IF NOT EXISTS idx_compliance_pci_status      ON compliance_records (pci_status);
CREATE INDEX IF NOT EXISTS idx_compliance_next_review     ON compliance_records (next_review_date ASC NULLS LAST);

-- ─── activity_log ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_activity_log_event_type  ON activity_log (event_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at  ON activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_name   ON activity_log (user_name);

-- ─── expenses ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_expenses_category      ON expenses (category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date  ON expenses (expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_logged_by     ON expenses (logged_by);

-- ─── settings ─────────────────────────────────────────────────────────────────
-- key column already has a UNIQUE constraint (implicit index); no additional index needed

-- ─── Enable trigram extension for GIN index above ─────────────────────────────
-- (safe to run even if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
