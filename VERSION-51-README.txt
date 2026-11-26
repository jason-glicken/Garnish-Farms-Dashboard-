Garnish Farms Dashboard - Version 51

Fixes from V50:
- Restores header inventory counts to the dashboard's primary batches data/renderKPIs() source. Removes duplicate V41 footer scripts that re-queried batch_items and overwrote valid Jar/Bag/Fruiting totals with zero.
- Fixes the cloud-sync indicator: successful sync clears stale inline gray styling so the connected state displays green; errors remain red.
- Fixes ID navigation to open the Production Pipeline card, the correct stage column, and the matching strain card before scrolling to and highlighting the exact production record.
- Keeps Supabase UUID values as strings in production action handlers and encodes UUIDs in record links.
- Makes IDs on the Upcoming page clickable and routes them to the matching current-stage production card on Home.

Deployment:
- Replace the files in the GitHub Pages main branch root with the files in this ZIP.
- No Supabase database migration is required. Existing Supabase data is not modified by this release.
- After deployment, open the site in Safari and refresh; if it appears cached, use a private tab or append ?v=51 to the site URL.
