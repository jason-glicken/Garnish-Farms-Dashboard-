# Garnish Farms Dashboard — Project Constitution

**Repository:** `jason-glicken/Garnish-Farms-Dashboard-`  
**Default branch:** `main`  
**Purpose:** The durable source of truth for architecture, product behavior, design decisions, and release discipline. Read this file before changing the project. Update it whenever a lasting decision changes.

## 1. Non-negotiable working agreement

- Treat the current GitHub repository as the source of truth. Retrieve the current files from GitHub; do not ask the user to re-upload source files that were created for this project.
- Make changes against the latest repository state, not an old ZIP, stale local copy, or remembered code snapshot.
- Preserve existing production records, Supabase configuration, authentication, calculations, IDs, and working features unless the user explicitly asks to change them.
- Do not claim a change was pushed, deployed, or verified unless the corresponding operation actually succeeded.
- If repository write access is available, commit the change to GitHub and verify the resulting file/commit. If it is not available, provide a complete, tested ZIP based on the latest repository contents and clearly explain the manual replacement steps.
- A release ZIP must contain the complete site needed for replacement, not a handful of disconnected patches. Do not include unrelated files or overwrite user data/configuration.
- Do not make the user repeat decisions already recorded here or in the current repository.

## 2. Architecture ownership

| Responsibility | Canonical owner | Rules |
|---|---|---|
| Page shell / asset loading | `index.html` | One app shell, one global header mount (`#gf-header`), one page-content mount (`#app`). |
| Global header markup and rendering | `GFUI.header(data)` in `gf3-ui.js` | The only header renderer. Called from the common app render path. Never recreate the header in an individual page. |
| Global visual design and responsive behavior | `gf3-styles.css` | The only stylesheet for app presentation. Edit canonical component rules; do not stack patch stylesheets or one-off overrides. |
| Page routing, page content, and interactions | `gf3-app.js` | Page-specific content and behavior only. No page-specific header markup, header layout, or visual theme decisions. |
| Production calculations / stage logic | `gf3-production.js` | Shared calculations and stage semantics; do not duplicate in page renderers. |
| Data access / persistence | `gf3-data.js` and existing Supabase integration | Preserve schema, auth, sync, and data semantics. Never reset or replace live data as a shortcut. |

If code is moved or these responsibilities change, update this table in the same change.

## 3. Shared header contract — locked

**Every dashboard page must render the exact same shared header component.** The page being viewed must not influence its structure, layout, spacing, sizing, colors, typography, borders, shadows, or responsive behavior.

- `GFUI.header(data)` is the sole source of header markup. The common render function calls it for every page.
- `#gf-header` is the sole mount point for the global header. `#app` contains page content only.
- Do not create page-specific headers, header variants, duplicate navigation, body-level global menus, or alternate header mounts.
- Do not use route/page checks to choose different header markup or header classes.
- Allowed data-driven differences are limited to content/state: current counts and yield, sync status, selected strain, and the current navigation item where applicable. These must not alter header geometry or styling.
- Active/selected states may change only their own visual indicator (for example, a border or background on the selected link), never the overall header layout.
- The header remains in this established order:
  1. Brand and sync status on the left; Settings on the right (Home access only if already part of the agreed shared design).
  2. Four compact production KPI cards.
  3. New Batch and Harvest actions, with Total Farm Yield alongside them.
  4. The always-visible strain ribbon as the final header row.
- New Batch uses the agreed soft-sage green treatment.
- Do not add a Pages dropdown, global page-navigation strip, or duplicate menu unless the user explicitly changes this decision.
- Do not add global navigation or duplicate strain filters inside `#app`.
- Remove unwanted markup, JavaScript, and obsolete CSS. Never leave an unwanted component in place and merely hide it with `display:none`.
- Sign out belongs in Settings, not as a separate global-header action.

## 4. Styling and design-system contract

- `gf3-styles.css` is the single source of truth for visual presentation, including desktop/mobile breakpoints.
- Individual page renderers may choose semantic content and reusable component classes, but must not make their own visual design choices.
- Do not add inline style declarations for layout, spacing, typography, colors, backgrounds, borders, radii, shadows, or sizing.
- Narrow exception: data-driven CSS custom properties may be emitted inline when the value genuinely varies by record or data visualization (for example, a chart segment color or measured bar position/width). The visual rule itself must remain in `gf3-styles.css`.
- Strain-specific colors are permitted as data tokens, not as page-specific design rules.
- Do not add new CSS sidecars, cache-busting patch files, or repeated override blocks to solve a styling issue. Edit the canonical rule and remove obsolete/conflicting declarations.
- Avoid broad `!important` overrides. Use a clear cascade and one canonical rule per component/state/breakpoint.
- Keep header dimensions and styles independent of route and page content.

## 5. Product behavior and preserved capabilities

Unless the user explicitly requests a change, preserve:

- Authentication, sign-in, sign-out, Supabase connectivity, cloud sync, and existing data.
- Strains and their scientific-name context where displayed.
- Parent batch identity and individual container identity (including child numbering such as “1 of 4”).
- Production stages and stage-promotion actions: grain spawn → bulk substrate → fruiting → harvest.
- Actual and targeted timelines, including completed stage segments and current progress.
- Links from batch/container IDs, forecast bars, and upcoming tasks to the exact relevant record and stage/action.
- Strain filtering and the ability to return to all strains.
- Correct counts and production summaries across Home, Batches, Jars, Bags, Fruiting, and strain views.
- Calendar, upcoming tasks, recent activity, yield, cultures, and Settings functionality when present in the current release.
- Established date formatting (MM/DD/YY) and the current batch/container ID conventions.

Do not silently remove, replace, or simplify a feature to make a visual change easier.

## 6. Required change workflow

Before changing code:

1. Read this file.
2. Inspect the current GitHub versions of every file involved and identify the actual source of the behavior.
3. Search for duplicate implementations, obsolete files, route-specific classes, inline styles, and conflicting CSS before adding anything.
4. State the intended source-of-truth change internally in the implementation; do not add a second system to compensate for the first.
5. Make the smallest coherent change that fixes the root cause.

After changing code:

1. Check syntax and references; ensure no missing assets or duplicate IDs/mounts.
2. Verify the shared header is rendered once from the same function on every route.
3. Check the header and page shell on Home, All Batches, Jars, Bags, Fruiting, Upcoming, Calendar, Yield, Cultures, Activities, Settings, and strain detail (where present).
4. Check mobile and desktop layouts.
5. Regression-check navigation, strain filtering/clearing, counts, New Batch, Harvest, yield, record links, timelines, auth, and data persistence.
6. Inspect the final diff for accidental data/config changes, stale CSS, dead markup, and duplicate overrides.
7. Report exactly what was changed and what was actually tested. Distinguish static/code checks from live browser, Supabase, or device testing.

A task is not “fully verified” just because files were edited or a ZIP passed integrity checks. Do not claim browser/live-data/mobile testing unless it was actually performed.

## 7. Known technical debt observed in the repository on 2026-11-27

These are inspection findings, not permission to make unrelated changes:

- The active shared header renderer is `GFUI.header(data)` in `gf3-ui.js`; `gf3-app.js` calls it from the common render function before selecting page content.
- `index.html` mounts the header at `#gf-header` and page content at `#app`.
- The active `gf3-styles.css` contains multiple repeated `.site-header`, `.strain-nav`, and responsive declarations, including late `!important` overrides. This is a cascade-maintenance risk and should be consolidated into canonical rules when the header styling is next addressed.
- The header renderer currently emits inline per-strain CSS custom properties for strain ribbon colors. Data-token use is allowed by the styling contract; page-specific visual styles are not.
- Legacy `shared-header.html`, `shared-header.js`, and `shared-header.css` were previously identified as an unused alternate header system. Confirm references across the repository before removing them; do not load or revive them as a second header.
- These findings do not establish the exact cause of any visual discrepancy between pages. Diagnose against the live current code and rendered routes before claiming a root cause.

## 8. Decision history

- **Shared header:** One shared header for every page; no page-specific header implementations.
- **Global styling:** One canonical stylesheet; no accumulating CSS sidecars or patch layers.
- **Unwanted UI:** Remove obsolete code instead of hiding it.
- **Header composition:** Brand/status and Settings, compact production cards, New Batch/Harvest/Yield actions, then the strain ribbon. No duplicate body menu.
- **Data safety:** Existing production data and Supabase integration must be preserved.
- **Release discipline:** Use the latest GitHub repository as source; verify the final change and be honest about what could not be tested.

---
*Last reviewed: 2026-11-27*
