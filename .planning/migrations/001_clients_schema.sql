CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dba_name TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  legal_structure TEXT,
  partner TEXT,
  partner_iso TEXT,
  crm_stage TEXT NOT NULL DEFAULT 'prospect',
  notes TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merchant_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  mcc TEXT,
  mcc_label TEXT,
  account_type TEXT NOT NULL DEFAULT 'card_present',
  pipeline_stage TEXT NOT NULL DEFAULT 'lead_identified',
  days_in_stage INT NOT NULL DEFAULT 0,
  monthly_volume NUMERIC DEFAULT 0,
  avg_ticket NUMERIC DEFAULT 0,
  card_present_pct INT DEFAULT 0,
  risk TEXT NOT NULL DEFAULT 'low',
  notes TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  merchant_account_id UUID REFERENCES merchant_accounts(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  doc_type TEXT,
  file_size INT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "admin_all_clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin_all_accounts" ON merchant_accounts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "admin_all_documents" ON client_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
