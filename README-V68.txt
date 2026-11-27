GARNISH FARMS DASHBOARD — V68 HEADER + STRAIN COLOR FIX

This is a small CSS overlay update based on the current GitHub V67 files.

Included:
- index.html: loads the new V68 overlay stylesheet after the existing V67 refinement stylesheet.
- gf3-v68-header-strain-fix.css: compact header KPI styling and strain-correct item-card styling.

Requested visual behavior:
1. The static header KPI cards use the same compact, rounded card treatment as the Production at a Glance cards.
2. Header KPI backgrounds retain their soft fills; all four header cards have the same Garnish green bottom accent.
3. Header card labels, numbers, and icons remain compact.
4. Each item card's left accent, title, and stage pill use that record's own strain color.
5. Selecting a strain filter no longer recolors every visible record to the active filter color; each card keeps its own strain identity.

Install:
- Replace index.html with this ZIP's index.html.
- Add gf3-v68-header-strain-fix.css to the repository root.
- Keep gf3-visual-refinement.css, gf3-styles.css, gf3-ui.js, gf3-app.js, all data files, and all production records unchanged.

Cache:
- The new stylesheet is linked as gf3-v68-header-strain-fix.css?v=68.

This is an overlay, not a full standalone website. No JavaScript, database, credentials, or production data are changed.
