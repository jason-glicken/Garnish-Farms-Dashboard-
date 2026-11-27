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
