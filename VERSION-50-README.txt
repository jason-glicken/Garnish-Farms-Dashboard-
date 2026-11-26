Garnish Farms Dashboard - Version 50

Fixes from V49:
- Fixed focused-record navigation for Supabase UUID IDs. V49 incorrectly converted record IDs to Number(), which turned UUIDs into NaN and prevented the exact production card from being found.
- Focus navigation now compares database IDs as strings, expands the correct strain/stage card, scrolls to the matching production row, and highlights it.
- Applied string-safe focus handling to Upcoming Task links.
- Made strain timeline record IDs and timeline bars open the matching production card on the main dashboard.

Important deployment note:
- V50 retains V49's dashboard page structure. If the live site still displays the older “Production at a glance” / “90-day production timeline” layout, GitHub Pages is not serving this index.html; verify the Pages publishing source (branch and folder) and that this ZIP's index.html replaced the published root index.html.
