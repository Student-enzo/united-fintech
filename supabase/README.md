# United Fintech — Supabase Database

**Project ref:** `peiioxwidinlhsjsbuvb`

## Migration files

| File | Purpose |
|------|---------|
| `20260605000001_create_enums.sql` | All PostgreSQL enum types + `moddatetime` extension |
| `20260605000002_create_users.sql` | Admin users and AE agents |
| `20260605000003_create_partners.sql` | ISO / sub-ISO / agent partner records |
| `20260605000004_create_merchants.sql` | Core merchant table with pipeline stage |
| `20260605000005_create_deals.sql` | Rate proposals (`UF-DEAL-XXXX` auto-numbering) |
| `20260605000006_create_agreements.sql` | MPAs (`MPA-XXXX` auto-numbering) |
| `20260605000007_create_residuals_commissions.sql` | Monthly residuals + agent commission splits |
| `20260605000008_create_compliance_activity.sql` | KYC/PCI compliance + append-only activity log |
| `20260605000009_create_expenses_settings.sql` | Expense tracking + key-value settings store |
| `20260605000010_create_indexes_rls.sql` | All indexes + RLS policies (permissive, tighten per role later) |
| `20260605000011_seed_data.sql` | Sample data matching admin portal mock data |

## Applying migrations

### Option A — Supabase MCP (recommended from Claude Code)

The MCP tools apply migrations directly to the remote project.
Run each file in order using `mcp__supabase__apply_migration` with the project ref `peiioxwidinlhsjsbuvb`.

### Option B — Supabase CLI

```bash
# Install CLI if needed
brew install supabase/tap/supabase

# Link to the remote project
supabase link --project-ref peiioxwidinlhsjsbuvb

# Push all migrations
supabase db push
```

### Option C — Supabase SQL Editor

Open https://supabase.com/dashboard/project/peiioxwidinlhsjsbuvb/sql/new and paste each file in order.

## Seed data row counts

| Table | Rows |
|-------|------|
| users | 3 |
| partners | 7 |
| merchants | 12 |
| deals | 8 |
| agreements | 10 |
| residuals | 10 |
| commissions | 18 |
| compliance_records | 10 |
| activity_log | 10 |
| expenses | 8 |
| settings | 6 |
| **Total** | **102** |

## Notes

- All money values are stored as **integer cents** (e.g. `$38,500.00` = `3850000`).
- `deal_number` uses sequence `deal_number_seq` starting at 1001; seed data advances it to 1008.
- `agreement_number` uses sequence `agreement_number_seq` starting at 1001; seed data advances it to 1010.
- RLS is enabled on all tables with permissive policies. Tighten to role-based policies once `auth.uid()` is wired to the `users` table.
- The `pg_trgm` extension (for GIN trigram search on `merchants.business_name`) is enabled in file 10. Run file 1 first to ensure `moddatetime` is available for all `updated_at` triggers.
