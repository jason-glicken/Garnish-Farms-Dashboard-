GARNISH FARMS — FRESH DASHBOARD BUILD

This is a new front-end application built from scratch. It uses the existing Garnish Farms Supabase project and existing public tables: batches, batch_items, harvests, cultures. It does not run migrations, alter tables, delete production records, or change authentication configuration.

DEPLOYMENT
1. Back up/download your current site files first.
2. Upload the CONTENTS of this folder to the root of the existing GitHub Pages site, replacing the old HTML/CSS/JS front-end files.
3. Keep all files in this folder together in the site root.
4. Open the site and sign in with the existing Supabase account.

PAGES INCLUDED
Home / Production at a Glance, All Batches / Containers, Jars, Bags, Fruiting, Strain pages, Container Management, New Batch, Harvest, Upcoming Tasks, Production Calendar, Cultures, Yield, Activities, Settings, Login.

DATABASE SAFETY
The app only reads existing records and performs user-initiated inserts/updates against the existing tables. No schema migration is included. Browser-local stage targets are stored in localStorage. Harvesting adds a harvests row and marks the selected batch_items record Harvested. Stage changes append to that container's stage_history JSON field and update existing lifecycle date columns.

IMPORTANT FIRST-BUILD LIMITATIONS
- Existing records without child batch_items appear as legacy containers and are view-only in the container manager until converted through a separate, reviewed data operation.
- Actual timelines use available lifecycle date columns and do not invent missing historic transition dates.
- The calendar currently highlights recorded start dates; it is a basic monthly overview, not yet a full task scheduler.
- Confirm the existing Supabase Row Level Security policies allow the signed-in owner to select/insert/update these tables. This front-end does not weaken or modify RLS.
- Test with a small record first after deployment. No authenticated browser end-to-end test was available in this build environment.
