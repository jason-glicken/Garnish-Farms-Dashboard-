# Garnish Farms Project Rules

- The global header and navigation are shared components rendered once for every page.
- Header order: brand/status + Settings/Home; production count cards; New Batch/Harvest/Yield actions; strain ribbon; main page navigation.
- Sign out belongs inside Settings, never as a separate global-header link.
- Do not render global navigation, strain ribbons, or duplicate filter controls inside `#app`.
- A selected strain is represented by the shared strain ribbon; do not add a redundant body-level clear-filter banner.
- Preserve production data, Supabase configuration, stage calculations, batch/container identity, and existing page functionality during visual changes.
- Before release, inspect all pages and test page navigation, strain filtering/clearing, counts, actions, record links, and Settings sign-out.
- Do not call a build fully verified unless browser/live-data testing has actually been completed.

## Central design system rules
- `gf3-styles.css` is the single source of truth for visual presentation.
- Pages and renderers must use shared component classes; they must not introduce page-specific style declarations or CSS files.
- Do not add inline `style` declarations for colors, backgrounds, borders, spacing, typography, shadows, radii, or layout.
- The only permitted inline `style` attributes are data-only CSS custom properties for values that genuinely vary per record or chart (for example a measured bar width or chart segment color). The actual visual declarations must remain in `gf3-styles.css`.
- Add new reusable components to the central stylesheet and document their class names.
- Keep responsive behavior in the central stylesheet.
- Do not append one-off override stylesheets or repeated override blocks. Edit the canonical component rule instead.
- Any design-system change must be checked on Home, All Batches, Jars, Bags, Fruiting, Upcoming, Calendar, Yield, Cultures, Activities, Settings, and strain detail.

## Header integration rule (V10)
- Main page navigation is a child of `.site-header`, alongside the strain ribbon.
- `GFUI.header(data)` renders exactly one `.site-header`, one `.strain-nav`, and one `.page-nav` inside `#gf-header`.
- Never append `.page-nav` as a sibling after `.site-header`.
- `#app` contains page content only; global navigation belongs exclusively in `#gf-header`.

## V11 navigation and action styling
- Do not render a permanent horizontal page-navigation strip between the shared header and page content.
- Global page links live in the compact `details.header-pages` menu inside the shared header.
- `#app` begins directly after the shared header; no global navigation is rendered in page content.
- The New Batch action uses the central soft-sage action style in `gf3-styles.css`; do not add page-specific button colors.

## V12 shared header contract — locked
- The shared header contains only: brand/sync/Settings/Home; production count cards; New Batch/Harvest/Total Farm Yield; strain ribbon.
- The strain ribbon is the final header row.
- Do not render a Pages dropdown, page-navigation row, or any global navigation menu.
- Do not render global navigation inside #app. Page content begins immediately after the strain ribbon.
- New Batch uses the central soft-sage style in gf3-styles.css.
- Keep this architecture unchanged unless the user explicitly requests a header change.

## V13 — remove obsolete navigation code
- Global page navigation is not part of the product header or page body.
- Do not add page-nav or Pages-menu markup, styles, or hide/show workarounds.
- When removing an unwanted component, remove its markup and obsolete CSS selectors rather than leaving it hidden with display:none.
- The strain ribbon is the final header row; page content begins immediately below it.
