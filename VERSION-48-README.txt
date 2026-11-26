GARNISH FARMS DASHBOARD - VERSION 48

RECORD-LEVEL NAVIGATION

- Production container IDs on Jars, Bags, Fruiting, and All Batches cards are clickable.
- Clicking an individual container ID opens Batch Management with the parent record ID and selected item ID in the URL.
- Parent batch IDs in grouped All Batches cards open that parent batch.
- The 3-month forecast now links to the matching pipeline row (rather than the generic pipeline section).
- Pipeline rows have stable DOM targets based on their database record ID.
- Upcoming task links retain their record/stage identifiers and jump to the matching pipeline row; the destination is scrolled into view and briefly highlighted.
- Fruiting tasks link to the Harvest page with a return location to the matching pipeline row.

ID STANDARDIZATION
- Parent batch: STRAIN-MMDDYY (1-N), e.g. BO-111826 (1-4).
- Individual container: STRAIN-MMDDYY-N, e.g. BO-111826-1.
- Position labels: 1 of N, 2 of N, etc.
- Date segment: MMDDYY.
- Legacy stored identifiers remain unchanged in the database; canonical IDs are display labels.
- Existing parent-child UUID relationships are preserved.

LIFECYCLE / TIMELINES
- Preserves V47/V46 individual actual and targeted lifecycle timelines.
- Does not rewrite lifecycle dates or stage history.

DEPLOY
1. Extract the ZIP.
2. Replace repository files with the contents of the Garnish-Farms-Dashboard--main folder.
3. Commit and push to the main branch.
4. Refresh the dashboard.

VALIDATION
- ZIP integrity checked.
- Inline JavaScript syntax checked where available.
- Not tested against the live Supabase project or physical iPhone Safari.
- Batch Management selected-item focus and cross-device behavior should be verified after deployment.
