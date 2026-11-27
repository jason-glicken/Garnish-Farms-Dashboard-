# Garnish Farms Dashboard — V6

Frontend-only dashboard package. Uses the existing Supabase project and current data tables; it does not include database migrations or destructive data operations.

## Global navigation and strain filtering
- The strain ribbon is available on every dashboard page.
- Selecting a strain filters the current page's records and keeps that page's navigation tab selected.
- The selected strain chip stays highlighted until changed or cleared.
- The **All strains** chip clears the filter.
- On an individual strain detail page, selecting another strain opens that strain's detail page.
- Page navigation preserves an active strain filter, so moving from Jars to Bags, for example, keeps the chosen strain filter.

## Install
Upload the contents of this folder to the existing GitHub Pages repository root, replacing files with matching names. Do not delete unrelated old files as part of this update. Keep the existing Supabase project and credentials in `gf3-data.js` unchanged.

## Safety
No SQL, schema changes, database resets, or production-record modifications are included.
