GARNISH FARMS GLOBAL FOUNDATION V7

Focus: close a remaining architecture leak by encapsulating the Supabase client.

Changes:
- Removed unused page-level aliases to the raw Supabase client from dashboard pages.
- Removed the public GFData.client and GFData.clientSync escape hatches.
- Kept the actual Supabase client private inside gf-data.js.
- Added a small GFData.ready capability flag for the home page initialization guard.
- Preserved repository methods as the supported route for production-table access.

Safety:
- No live Supabase schema or records changed.
- No GitHub files deployed.
- Existing SQL migration files remain review-only.

Limitations:
- This is a static architecture hardening pass, not authenticated browser testing.
- Some older page code still uses compatibility repository methods; those remain candidates for later cleanup.
