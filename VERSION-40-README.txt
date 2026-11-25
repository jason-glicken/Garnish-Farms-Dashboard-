GARNISH FARMS DASHBOARD — VERSION 40

Built from the complete V39 package.

Changes:
- Normalize status, container, stage, and strain matching in the container list so case/spacing/legacy naming differences do not silently filter out records.
- Normalize strain production stage/status matching for the Production at a Glance pages.
- Populate shared header counts and Total Farm Yield on secondary pages from the same Supabase batches/harvests tables used by the dashboard.
- Give the Home page New Batch / Harvest / Total Farm Yield row its own explicit three-column full-width layout.
- Preserve parent batches and child container records; no database migration or data mutation is included.

Validation: ZIP integrity and JavaScript syntax checks performed locally. No live Supabase credentials/session or iPhone Safari visual session was available, so live database rendering remains to be confirmed after deployment.
