GARNISH FARMS DASHBOARD - VERSION 46

Fixes:
- Repairs actual timeline fill rendering. The V45 nested positioned fill element was not visibly filling on the deployed mobile page in the user's screenshot.
- Actual line now uses a CSS linear gradient for each stage: completed stages remain fully colored, the current stage fills proportionally to actual elapsed days, and future stages remain pale.
- Completed stage labels show elapsed actual days when the next stage's actual start date is available.
- Targeted line remains a separate full-color schedule line underneath.
- No database migration required. Uses V44 lifecycle fields.

Validation:
- Source change is limited to list.html timeline rendering.
- Deploy the full package to GitHub Pages.
- Verify on a multi-container batch and one historical record.
