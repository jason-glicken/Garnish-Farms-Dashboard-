GARNISH FARMS DASHBOARD — V69 LIST SEPARATION + HEADER ACTION TILES

Included files:
- index.html: loads the two V69 additions after the existing V68 styles and app.
- gf3-v69-list-separation.js: keeps physical Jars and Bags lists separate.
- gf3-v69-header-actions.css: styles New Batch, Harvest, and Total Farm Yield as compact header cards.

List behavior:
- Jars page includes records whose container type is Jar.
- Bags page includes records whose container type is Bag or Block.
- Container type takes precedence over current lifecycle stage. A bag in Grain Spawn remains in Bags; a jar in Bulk Substrate remains in Jars.
- Older records without a container type use stage as a fallback (Grain Spawn -> Jars, Bulk Substrate -> Bags).
- The active-record count is updated to match the filtered list.

Header actions:
- New Batch, Harvest, and Total Farm Yield now share the compact rounded tile treatment.
- All three have a consistent Garnish green bottom accent and pale green background.

Install:
1. Replace index.html.
2. Add gf3-v69-list-separation.js to the repository root.
3. Add gf3-v69-header-actions.css to the repository root.

Keep all existing data, database, authentication, and other JavaScript/CSS files unchanged.
The new assets use cache version 69.
