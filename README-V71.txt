GARNISH FARMS V71 — STRAIN TIMELINE GROUPING PATCH

This patch fixes the strain-page 90-day production timeline so records are grouped
into separate Jars and Bags sections rather than one mixed list.

Grouping rule:
- The saved physical container type (Jar / Bag / Block) takes priority.
- A bag remains in Bags even while it is in Grain Spawn.
- A jar remains in Jars if it has advanced to a later lifecycle stage.
- Only records without a physical container value use the legacy stage fallback.

The existing timeline row links, strain styling, actual bars, target bars, and
today marker are retained.

INSTALL:
1. Replace the repository's index.html with the included index.html.
2. Add gf3-v71-timeline-groups.js to the repository root.
3. Add gf3-v71-timeline-groups.css to the repository root.
4. Deploy the site and hard-refresh the browser.

This is a focused patch ZIP, not a full export of every repository file.
It does not change Supabase data.
Cache-busting version: 71.
