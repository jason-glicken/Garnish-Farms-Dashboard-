Garnish Farms — ID Format + Calendar Refinement

Replace these four files in the repository root:
- gf3-app.js
- gf3-data.js
- gf3-production.js
- gf3-styles.css

ID rule: parent batch ID is STRAIN-MMDDYY; every child container ID is parent ID plus its 1-based position, including single-container batches (example: GT-112726-1). Existing displayed IDs are normalized from parent ID + position; no existing Supabase records are rewritten. New batches store the parent ID without a trailing sequence, and child container IDs always receive exactly one position suffix.

Calendar: adds previous/next month navigation, a compact responsive 7-column grid, non-wrapping event chips, a today marker, and a +N more indicator when a day has more than two records. Existing record links remain intact.

No schema changes, data migrations, or Supabase settings changes.
