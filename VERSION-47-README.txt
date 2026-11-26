GARNISH FARMS DASHBOARD - VERSION 47

ID STANDARDIZATION + PRESERVED V46 LIFECYCLE TIMELINES

ID FORMAT
- Parent batch display: STRAIN-MMDDYY (1-N), e.g. BO-111826 (1-4).
- Individual container display: STRAIN-MMDDYY-N, e.g. BO-111826-1.
- Individual position badge: 1 of 4, 2 of 4, etc.
- Dates in IDs use MMDDYY.
- Arbitrary legacy suffixes such as GF-261118-69 are not shown.
- Legacy records are displayed using their strain and recorded date, so older GF-prefixed or sequence-suffixed IDs resolve to the canonical display format.
- New batch creation stores the canonical parent base ID and creates canonical child IDs.
- Adding a container from Batch Management also uses the canonical child ID.
- The parent range is a display label; the underlying parent database row ID remains unchanged, preserving relationships.

PAGES UPDATED
- Home dashboard: parent batch labels now include the container range.
- New Batch: preview shows parent range plus each child ID.
- Jars, Bags, Fruiting, and All Batches: every individual card displays its canonical child ID and parent batch label.
- All Batches remains grouped by parent batch with expandable individual containers.
- Strain pages: individual cards use canonical IDs and parent range labels.
- Batch Management: parent heading and individual container IDs use the same convention.

LIFECYCLE / TIMELINE
- Retains the V46 actual timeline fill correction.
- Actual timeline remains one continuous stage-colored line per individual container.
- Targeted timeline remains a separate line directly underneath.
- Each child container retains its own lifecycle dates and target settings.

DATABASE
- No database migration is required for this display/generation correction.
- Existing UUID relationships and parent-child links are not rewritten.
- Existing legacy stored IDs are normalized for display. Newly created records use the canonical convention.

DEPLOY
1. Extract the ZIP.
2. Replace the files in the GitHub Pages repository with the contents of the Garnish-Farms-Dashboard--main folder.
3. Commit and push to the main branch.
4. Refresh the site. If the old page remains cached on iPhone, close and reopen the tab or test in a private tab.

VALIDATION
- Inline JavaScript syntax checked with Node for all HTML pages.
- ZIP integrity checked.
- Not tested against the live Supabase project or on physical iPhone Safari.
