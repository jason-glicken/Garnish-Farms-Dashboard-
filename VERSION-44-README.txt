GARNISH FARMS DASHBOARD — VERSION 44 MIGRATION CORRECTION

This package preserves the V43 dashboard HTML and includes a corrected lifecycle migration for the actual Supabase data export supplied for review.

Verified from the uploaded batches.csv:
- 35 parent batch rows
- 64 total containers represented by quantity
- 63 Active containers and 1 Contaminated container
- Parent batch ID CH-161126-64 occurs on two separate parent rows (database IDs 8 and 9)
- Uploaded batch_items query returned 0 rows

Migration correction:
- Adds the V41 lifecycle columns.
- Materializes individual child records from each parent row's quantity.
- Keeps the two duplicate CH-161126-64 parent rows separate and generates collision-safe child IDs for them using the parent database row ID.
- Backfills only known dates from current-stage dates, stage_history, or supported note tags; it does not invent unknown dates.
- Does not delete or rewrite parent batch records.
- Includes a verification SELECT at the end. For the supplied export, expected counts are 35 parent rows, 64 individual rows, 63 active, and 1 contaminated.

IMPORTANT:
1. Export/backup batches and batch_items first (the user has already exported both; batch_items returned 0 rows).
2. Run this corrected v41-lifecycle-migration.sql once in Supabase SQL Editor.
3. Confirm the final verification query returns the expected counts before deploying/testing the dashboard.
4. Do not run the older uncorrected V41 SQL as well.

The V43 HTML files are retained unchanged. This release corrects the database migration; it does not claim that a live Supabase migration or browser session has been tested.
