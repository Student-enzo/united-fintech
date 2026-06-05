-- Migration: 20260605000002_create_users.sql
-- Purpose: Admin users and agents table

CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  full_name     text NOT NULL,
  role          user_role NOT NULL DEFAULT 'ae',
  pin_hash      text,                          -- bcrypt hash of 4-digit PIN for quick access
  avatar_url    text,
  is_active     boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Permissive policy (tighten per role later)
CREATE POLICY "users_all_access" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
