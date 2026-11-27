GARNISH FARMS DASHBOARD — VERSION 61
Shared Header Isolation + Container-Level Home Pipeline

CHANGES
- The global header now renders inside a Shadow DOM root. Page-level styles cannot leak into or alter the shared header.
- Header markup and styling are defined only in shared-header.html and shared-header.css. Removed inline header layout styles.
- All pages load the same cache-busted shared-header.js version.
- Header navigation, KPI cards, action row, and strain navigation use one responsive layout and one stylesheet.
- Shared header data/status updates now target the Shadow DOM component rather than page document IDs.
- The production snapshot now explicitly preserves the parent database ID, human-readable parent batch ID, and child container ID on each normalized container record.
- Home production pipeline now renders active individual containers from the shared production snapshot, rather than parent batch rows. Stage totals therefore reflect individual active containers.

DATABASE SAFETY
- No Supabase schema, migration, or production record was changed.
- This build only changes dashboard code and presentation.

VERIFICATION
- JavaScript syntax validation performed for shared scripts and inline page scripts.
- ZIP contents and expected shared-component files checked.
- No authenticated browser end-to-end test was available in this build environment.
