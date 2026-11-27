GARNISH FARMS DASHBOARD — GLOBAL FOUNDATION V6

Purpose
Strengthen the harvest data model before any live migration is approved.

Changes
- Updated the review-only harvest migration to include batch_pk bigint referencing public.batches(id) with ON DELETE SET NULL.
- Retained batch_id as the human-readable identifier used in existing harvest history displays.
- Added an index for batch_pk and retained date/strain indexes.
- Updated the harvest form to send both batch_pk and batch_id.
- Documented the relationship and deletion behavior.

Safety
- No live Supabase schema, policy, or production record was changed.
- No migration was executed.
- Existing public.harvests table was absent in the last read-only schema inspection.

Verification
- Static JavaScript syntax checks run for inline and shared scripts.
- ZIP integrity checked.
- Migration reviewed against the verified batches.id bigint primary key and existing owner-only RLS pattern.
- Authenticated browser workflow and migration execution remain NOT RUN.
