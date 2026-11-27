GARNISH FARMS DASHBOARD — GLOBAL FOUNDATION V4

Purpose
Continue the database-first cleanup by removing browser-local copies of production facts where the same facts are already stored in Supabase.

Changes
- Removed the home page's localStorage batch cache and stale-cache fallback. If Supabase cannot load production batches, the page now reports a database error instead of rendering old records as if they were current.
- Removed localStorage as a second source for Grain Spawn shake status. The dashboard now derives the status from the [Shaken YYYY-MM-DD] event stored in the batch notes in Supabase.
- Shake actions now check the database update result and do not report a successful UI update if the Supabase write fails.
- Removed duplicate local stage-clock storage from home, list, and upcoming pages. These pages derive actual stage dates from the stage date tags stored in the batch notes, then fall back to the batch date when no stage tag exists.
- Kept user preferences and planning inputs (stage target defaults, timeline horizon, due-soon threshold, rhythm planner assumptions, and form defaults) in localStorage for now. These are configuration/preferences, not production records; moving them to a database settings table requires a separate schema and ownership decision.

Important boundaries
- No Supabase SQL, migration, schema, policy, or production data was changed.
- Harvest table remains absent from the last read-only schema audit. The harvest migration is still review-only.
- Batch item lifecycle history is already represented in batch_items.stage_history and stage date columns. The parent-batch pages still use legacy note tags for some stage timing; a future pass should consolidate all lifecycle timing on batch_items and define a safe compatibility path for older records.
- Static syntax checks do not replace authenticated browser workflow testing.

Verification
- All inline scripts in dashboard HTML pages passed Node.js syntax checks.
- No direct production-table queries remain in page HTML; table access remains in gf-data.js.
- No batch cache, local shake-state, or local stage-clock keys remain in dashboard source.
- ZIP integrity checked after packaging.

Next
1. Resolve the lifecycle source-of-truth design: batch_items stage_history and lifecycle date columns versus legacy parent notes.
2. Review and approve the harvest table migration before applying it.
3. Browser-test all workflows with the authenticated account, including stage changes, shake logging, deletion, and harvest failure handling.
