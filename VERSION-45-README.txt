GARNISH FARMS DASHBOARD - VERSION 45
Individual container lifecycle timeline redesign

WHAT CHANGED
- Jars, Bags, Fruiting, and All Batches individual container cards now show a compact two-line lifecycle view.
- ACTUAL is one continuous horizontal segmented line. Completed stages remain filled in their stage colors; the current stage fills according to elapsed days; future stages remain lightly tinted and labeled as next/planned.
- TARGETED is a separate horizontal line directly underneath, showing the planned duration for Grain Spawn, Bulk Substrate, and Fruiting.
- Stage segment widths use the configured target durations, so Actual and Targeted lines share the same stage proportions and are easy to compare.
- Every child container uses its own lifecycle dates, stage history, target_days, and target_overrides.
- The next stage label is visible from the beginning (e.g. Grain: Day 1, Substrate: Next, Fruiting: Next).
- Corrected the list-card current-stage date fallback so a later-stage record does not automatically display the parent batch date as a Grain Spawn start.

DATABASE
- No new migration is required. V45 uses the V41 lifecycle columns already introduced by the V44 migration package.
- Keep the V44 migration already run; do not rerun it for this display update.

DEPLOY
1. Extract this ZIP.
2. Replace the files in the GitHub Pages repository with the contents of the Garnish-Farms-Dashboard--main folder.
3. Commit/push to the main branch.
4. Refresh the site. If the old page remains cached on iPhone, close the tab and reopen the page, or use a private tab for a clean check.

VALIDATION
- JavaScript syntax checked with Node.
- ZIP integrity checked.
- Not tested against the live Supabase project or on physical iPhone Safari.
