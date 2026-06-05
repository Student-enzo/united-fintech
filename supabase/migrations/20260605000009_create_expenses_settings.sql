-- Migration: 20260605000009_create_expenses_settings.sql
-- Purpose: Business expense tracking and platform key-value settings store

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category     expense_category NOT NULL DEFAULT 'office',
  description  text NOT NULL,
  amount_cents integer NOT NULL,              -- amount in cents (always store money as integer cents)
  vendor       text,
  receipt_url  text,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  logged_by    text,                          -- user name or email (denormalized)
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Settings: flexible key-value store for platform configuration
CREATE TABLE IF NOT EXISTS settings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text NOT NULL UNIQUE,
  value      jsonb NOT NULL DEFAULT 'null'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger for settings
CREATE TRIGGER set_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "expenses_all_access" ON expenses
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Settings: only admins should write in production; permissive for now
CREATE POLICY "settings_all_access" ON settings
  FOR ALL
  USING (true)
  WITH CHECK (true);
