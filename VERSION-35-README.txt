GARNISH FARMS — VERSION 35

Start from the included HTML files. Before creating new batches, run v35-supabase-migration.sql in the Supabase SQL Editor. This creates the batch_items child table used for independent container IDs, stages, statuses, notes, and stage history.

New batch behavior: parent ID is STRAIN-MMDDYY (example LM-112526). Individual containers are LM-112526-1, LM-112526-2, etc. The Batch Details page lets each child container progress independently.

Existing v34 batches are retained as parent records; this migration does not fabricate individual historical container records for them.
