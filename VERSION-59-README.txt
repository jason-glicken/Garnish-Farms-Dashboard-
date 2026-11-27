GARNISH FARMS DASHBOARD — VERSION 59
Existing-account email/password sign-in

This update adds a login page using Supabase Auth signInWithPassword, an authentication guard for dashboard pages, and a Sign out control in the shared header. It does not create users, change passwords, modify Supabase Auth settings, alter database records, or deploy to GitHub.

Use the email and password for the existing Supabase Auth user. The login page deliberately has no sign-up flow. If the deployed GitHub Pages URL is not configured in Supabase Auth URL Configuration / Redirect URLs, password sign-in itself can still work; the allow-list is primarily needed for redirect-based flows.

To test: deploy the ZIP contents to the existing GitHub Pages repository, open the dashboard, sign in with the existing account, verify data loads, then test Sign out. Do not run any SQL migration for this version.
