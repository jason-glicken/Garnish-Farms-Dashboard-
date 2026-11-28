Garnish Farms — consolidated CSS and compact production cards

Replace index.html and gf3-styles.css in the repository root with the two files in this ZIP.

What this package does:
- Keeps all visual styling in gf3-styles.css.
- Removes the four legacy CSS stylesheet links from index.html.
- Preserves the existing JavaScript module loading order and behavior.
- Consolidates the V68 header/strain rules, V69 header-action rules, and V71 timeline-group rules into gf3-styles.css.
- Keeps the compact card layout with strain / ID / container at the upper left and promotion / Manage Container actions at the upper right.
- Reduces card padding, button height, metadata spacing, and timeline spacing.

After replacing these two files, delete these now-unreferenced CSS files from the repository:
- gf3-visual-refinement.css
- gf3-v68-header-strain-fix.css
- gf3-v69-header-actions.css
- gf3-v71-timeline-groups.css

Do not delete the JavaScript files gf3-v69-list-separation.js or gf3-v71-timeline-groups.js; they remain loaded by index.html.
No database schema or production records are changed.
