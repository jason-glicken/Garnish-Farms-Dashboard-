GARNISH FARMS DASHBOARD — VERSION 41

Built from V40 with an individual-container lifecycle model.

Key changes:
- Individual batch_items are the source of truth for active Jars, Bags, and Fruiting counts. Parent batches remain unique batch groups. Legacy parent batches without child records are included as fallback inventory so older records remain visible.
- All Batches groups containers under their parent batch; each container is individually manageable. Stage filtering is based on each container's current stage rather than the parent batch's stage.
- Batch management page supports per-container stage transitions, actual stage dates, fruiting method, notes, status, and target-day overrides. It also supports advancing all active containers when they are at the same stage and adding a container to a batch.
- New batch creation records initial lifecycle dates, stage history, and target-day settings for each child container.
- Strain timeline reads the new explicit stage date fields while retaining legacy note-tag fallbacks.
- Shared header and home inventory counts use individual active containers and distinct parent batch IDs.
- Added additive v41-lifecycle-migration.sql. It preserves existing records, materializes legacy parent-only batches into editable child containers using their already-recorded quantity, and backfills only dates already present in stage history, legacy note tags, or current-stage record dates.

IMPORTANT SETUP:
1. Keep a backup of Supabase before changes.
2. Run the included v41-lifecycle-migration.sql in Supabase SQL Editor after the existing v36 migration.
3. Deploy the HTML files.
4. Use the batch page to complete a physical inventory and correct each container's dates/status/stage. Unknown historical stage dates are intentionally left blank for manual entry.

Validation: Local syntax checks and ZIP integrity checks are included in the build process. No live Supabase writes, production database migration, or iPhone Safari session were performed.
