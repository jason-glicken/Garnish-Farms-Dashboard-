GARNISH FARMS V43

Fixes:
- Removed the competing legacy parent-batch renderer on Jars/Bags/All Batches pages. The individual-container renderer is now the sole renderer, so each child record keeps its own timeline.
- Broadened stage/status normalization so child records with valid stage aliases or non-terminal active statuses are included in strain Production at a glance.
- Strain production cards and 90-day timeline now render individual child containers, with each container ID shown separately.

Deploy all HTML files from this package. No new SQL migration is included or required beyond the existing V41 lifecycle migration.

Validation: JavaScript syntax and ZIP integrity checks performed locally. No live Supabase query or iPhone Safari test was available.
