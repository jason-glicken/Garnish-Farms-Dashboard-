GARNISH FARMS — VERSION 36

Start from the included HTML files. Before creating new batches, run v36-supabase-migration.sql in the Supabase SQL Editor. This creates the batch_items child table used for independent container IDs, stages, statuses, notes, and stage history.

New batch behavior: parent ID is STRAIN-MMDDYY (example LM-112526). Individual containers are LM-112526-1, LM-112526-2, etc. The Batch Details page lets each child container progress independently.

Existing v34 batches are retained as parent records; this migration does not fabricate individual historical container records for them.

V36 note: the batch_items parent foreign key is BIGINT to match public.batches.id. If an earlier migration attempt created batch_items with a different type, inspect/drop that incomplete table before applying the corrected migration; do not drop a populated table.
