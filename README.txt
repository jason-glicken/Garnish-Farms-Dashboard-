# Garnish Farms Dashboard — Home-page data fix

This is a **targeted patch for `index.html` only**. It does not replace the working Jars/Bags pages or change Supabase data.

## What it changes
1. Canonicalizes batch status values when rows are mapped from Supabase:
   - `active`, ` ACTIVE `, and equivalent whitespace/case variants become `Active`.
   - harvested/completed variants become `Harvested`.
   - contaminated becomes `Contaminated`.
   - Unknown values are preserved rather than guessed.
2. Applies the same normalization to cached records when the cloud request fails.
3. Stops showing a misleading green “Cloud Synced” state when the query succeeds but returns zero batch rows. It reports “Connected · No batch records returned” with a neutral indicator instead.

## Apply
1. Download and unzip this package.
2. Open the current repository `index.html` from branch `main`.
3. Apply `home-dashboard-status-normalization.patch` to that exact file (the patch is based on the V51 `index.html` retrieved from the repository during preparation).
4. Review the resulting diff. It should affect only the status normalization, cache mapping, and sync message in `loadBatches()`.
5. Commit and deploy. Then check Home, Jars, Bags, and the strain pages.

## Important verification note
The repository connection available during preparation is read-only, so this package is **prepared but not deployed**. The patch is a focused test of the most likely cause visible in the code; the live Supabase status values were not directly inspectable. If Home still shows zero after this patch, the next step is to inspect the exact returned status values and compare the Home query with the list-page query—not to change the production records blindly.

## Source version
- Repository: `jason-glicken/Garnish-Farms-Dashboard-`
- File: `index.html`
- Retrieved Git blob SHA: `2d252a6fb7766ca04746feefb03d2f1e0c990e9f`
