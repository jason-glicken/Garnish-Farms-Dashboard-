GARNISH FARMS DASHBOARD — V65 CACHE + TIMELINE CLEANUP

Included files:
- index.html
- gf3-visual-refinement.css

Changes:
1. index.html now loads gf3-visual-refinement.css?v=65. The query-string version forces browsers to request the updated stylesheet instead of reusing a cached copy.
2. Timeline target dates are now a thin dashed upper rail.
3. Recorded actual progress is a separate solid lower bar.
4. The two timeline layers no longer overlap; the vertical Today marker remains visible.
5. Existing header card tints, compact KPI sizing, production card sizing, and icon sizing from V64 are retained.

Install:
- Replace index.html in the repository with this ZIP's index.html.
- Replace gf3-visual-refinement.css with this ZIP's stylesheet.
- Keep the existing gf3-styles.css and all JavaScript/data files unchanged.
- After deployment, open the site and reload once. The ?v=65 reference should make the browser fetch the new refinement stylesheet.

This is an overlay update, not a standalone site. No database, production data, JavaScript, or credentials are changed.
