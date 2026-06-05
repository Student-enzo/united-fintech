-- Migration: 20260605000008_create_compliance_activity.sql
-- Purpose: KYC/PCI compliance records and platform-wide activity log

-- Compliance records: one row per merchant (upsertable)
CREATE TABLE IF NOT EXISTS compliance_records (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id               uuid NOT NULL REFERENCES merchants (id) ON DELETE CASCADE,
  kyc_status                kyc_status NOT NULL DEFAULT 'pending',
  pci_status                pci_status NOT NULL DEFAULT 'in_progress',
  risk_level                risk_level NOT NULL DEFAULT 'low',
  last_review_date          date,
  next_review_date          date,
  -- Document checklist (boolean flags)
  doc_business_license      boolean NOT NULL DEFAULT false,
  doc_voided_check          boolean NOT NULL DEFAULT false,
  doc_owner_id              boolean NOT NULL DEFAULT false,
  doc_processing_statements boolean NOT NULL DEFAULT false,
  doc_pci_saq               boolean NOT NULL DEFAULT false,
  -- Free-text compliance flag note
  flag_note                 text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now(),

  -- One compliance record per merchant
  UNIQUE (merchant_id)
);

-- updated_at trigger
CREATE TRIGGER set_compliance_records_updated_at
  BEFORE UPDATE ON compliance_records
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Activity log: append-only audit trail
CREATE TABLE IF NOT EXISTS activity_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  event_type NOT NULL,
  description text NOT NULL,
  detail      text,                          -- JSON or free text for extra context
  user_name   text,                          -- who triggered the event (denormalized)
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compliance_records_all_access" ON compliance_records
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "activity_log_all_access" ON activity_log
  FOR ALL
  USING (true)
  WITH CHECK (true);
