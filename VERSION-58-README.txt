GARNISH FARMS GLOBAL FOUNDATION V8

Focus: explicit authentication diagnostics and fail-visible database reads.

Changes:
- Added read-only GFData.getAuthState() and GFData.onAuthStateChange() methods.
- Shared header now checks for an active Supabase Auth session before querying protected production tables.
- Header reports “Sign-in required” when there is no active session, rather than implying a sync failure with no explanation.
- Header refreshes after sign-in, sign-out, token refresh, or user update events.
- Removed silent empty-array fallbacks for batch_items reads on the All Batches and strain pages. A failed query now displays an explicit error instead of masquerading as zero containers.

Important finding:
- This ZIP contains no login page and no sign-in/sign-out flow. This pass deliberately does not invent an authentication method or collect credentials. The dashboard uses the Supabase publishable key and the live database has owner-only policies for the authenticated role. A real authenticated browser test and a user-approved sign-in design are still required.

Safety:
- No live database schema or records changed.
- Harvest migration remains review-only and is not executed.
- No GitHub deployment performed.
