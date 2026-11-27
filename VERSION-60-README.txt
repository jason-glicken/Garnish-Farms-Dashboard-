GARNISH FARMS DASHBOARD — VERSION 60
CANONICAL SHARED PRODUCTION DATA

- Extends the existing gf-data.js; does not create a second data client or data file.
- Adds GFData.getProductionSnapshot(), a single authoritative read for parent batches and individual batch_items.
- Joins child containers to parent batch metadata and returns one normalized record per container.
- Expands legacy parent-only batches by quantity when no child rows exist for that parent.
- Home inventory KPIs and strain summary use normalized container records.
- Home 90-day farm forecast uses individual container records.
- Strain pages and Jars/Bags/Fruiting/All lists use the same shared snapshot rather than custom joins.
- Keeps parent batches separate for existing batch-level editing and actions.
- No Supabase schema or production records changed. No GitHub deployment performed.

Verification: JavaScript syntax checks and static consistency checks are required; authenticated browser testing remains necessary before production deployment.
