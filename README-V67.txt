GARNISH FARMS DASHBOARD — V67 STRAIN COLOR IDENTITY

Included files:
- index.html
- gf3-ui.js
- gf3-visual-refinement.css

What changed:
1. Strain filter pills use the established strain palette, including a filled selected state.
2. The active strain color is exposed as a shared theme variable for strain-filtered pages.
3. Production at a Glance cards inherit the selected strain's color on that strain's page.
4. Individual container cards keep their own strain color and tint.
5. Actual lifecycle progress is a solid fill in the strain color.
6. Target lifecycle indicators are dashed in that same strain color. Solid vs dashed distinguishes actual from target.
7. The 90-day timeline on a strain page uses that strain's color for both actual and target segments.
8. index.html references gf3-visual-refinement.css?v=67 to force a fresh stylesheet request.

Install:
- Replace index.html in the repository.
- Replace gf3-ui.js in the repository.
- Replace gf3-visual-refinement.css in the repository.
- Leave all other files and production data unchanged.

This is an overlay update for the current dashboard, not a standalone website.
No database schema, credentials, Supabase records, or production history are changed.
