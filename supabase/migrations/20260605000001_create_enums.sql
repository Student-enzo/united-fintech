-- Migration: 20260605000001_create_enums.sql
-- Purpose: Define all enum types used across the United Fintech schema

-- Enable moddatetime extension for updated_at triggers
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'ae', 'partner_manager');

-- Partner / ISO types
CREATE TYPE iso_type AS ENUM ('iso', 'sub_iso', 'agent');

-- Generic active/inactive/pending statuses
CREATE TYPE partner_status AS ENUM ('active', 'pending', 'suspended');

-- Merchant account types
CREATE TYPE account_type AS ENUM ('card_present', 'ecommerce', 'moto', 'ach');

-- Merchant legal structures
CREATE TYPE legal_structure AS ENUM (
  'sole_proprietor',
  'llc',
  'corporation',
  's_corp',
  'partnership',
  'non_profit'
);

-- Merchant risk levels
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');

-- Merchant pipeline stages
CREATE TYPE pipeline_stage AS ENUM (
  'lead_identified',
  'proposal_sent',
  'agreement_sent',
  'agreement_signed',
  'setup_fee_paid',
  'underwriting',
  'account_activated',
  'merchant_live',
  'declined'
);

-- Deal rate models
CREATE TYPE rate_model AS ENUM ('interchange_plus', 'flat_rate', 'tiered');

-- Deal statuses
CREATE TYPE deal_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined');

-- Agreement term lengths
CREATE TYPE term_length AS ENUM ('1yr', '2yr', '3yr');

-- Agreement statuses
CREATE TYPE agreement_status AS ENUM (
  'draft',
  'sent',
  'signed',
  'active',
  'under_review',
  'terminated',
  'expired'
);

-- Residual payout statuses
CREATE TYPE residual_status AS ENUM ('pending', 'paid', 'overdue');

-- Agent roles for commissions
CREATE TYPE agent_role AS ENUM ('ae', 'senior_ae', 'partner_manager');

-- KYC statuses
CREATE TYPE kyc_status AS ENUM ('verified', 'pending', 'failed');

-- PCI compliance statuses
CREATE TYPE pci_status AS ENUM ('compliant', 'in_progress', 'non_compliant');

-- Activity log event types
CREATE TYPE event_type AS ENUM (
  'agreement_created',
  'merchant_activated',
  'deal_sent',
  'partner_added',
  'commission_paid',
  'compliance_flagged',
  'settings_changed',
  'login'
);

-- Expense categories
CREATE TYPE expense_category AS ENUM (
  'software',
  'travel',
  'entertainment',
  'marketing',
  'legal',
  'office',
  'contractor'
);
