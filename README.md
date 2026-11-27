# Garnish Farms Dashboard — Header Restoration Build

This build starts from Garnish-Farms-Clean-Rebuild V6, preserving its production and Supabase implementation.

## Header layout
1. Brand, cloud sync status, Settings and Home.
2. Batches / Jars / Bags / Fruiting count cards.
3. New Batch / Harvest / Total Farm Yield actions.
4. Strain ribbon.
5. Main page navigation.

The same `GFUI.header(data)` function is called centrally by the app renderer for every page. Sign out is now inside Settings.

## Body
The redundant body-level "Showing strain · Clear strain filter" banner/link has been removed. Strain selection and clearing remain in the shared strain ribbon. Record, batch, and strain-detail links that are part of actual data remain intact.

## Preservation
No database schema, Supabase configuration, production stage calculations, batch logic, or record data files were intentionally changed. The build uses the V6 application/data/production files, with only `gf3-ui.js` and `gf3-app.js` changed.

## Verification
JavaScript syntax and archive integrity were checked. This package has not been deployed or visually tested against live Supabase data. Verify the header on Home, All Batches, Jars, Bags, Fruiting, Upcoming, Calendar, Yield, Cultures, Activities, Settings, and strain detail pages after deployment.

## Central CSS design system
`gf3-styles.css` is the single visual source of truth. Page renderers use shared classes. The only remaining inline `style` attributes supply data-only CSS custom properties for chart/visualization values; all presentation declarations for those values are in the central stylesheet. No page-specific stylesheet was added.

The previous visual behavior was preserved rather than redesigning page components. This is a first consolidation step: the existing stylesheet still contains legacy cascade sections, so future cleanup should consolidate duplicate selectors deliberately and verify screenshots before removing old declarations.

## V10 header cleanup
The main page navigation is rendered inside the shared `.site-header` rather than appended as a separate sibling strip. The shared header wrapper owns sticky positioning and visual continuity. CSS tightens spacing and integrates the page navigation and strain ribbon into one visual unit. Production and data modules are unchanged.
