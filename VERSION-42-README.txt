GARNISH FARMS DASHBOARD — VERSION 42

Fix: Jars and Bags individual-container cards now render a separate lifecycle timeline for every container. Timeline stage dates are sourced from each child record's grain_started_on, bulk_started_on, fruiting_started_on, current_stage_started_on, and stage_history fields, with the batch date used only as a fallback for Grain Spawn. Target durations use each container's target_days and target_overrides values, falling back to the dashboard defaults.

Deployment:
1. Back up the current deployed files.
2. Replace the existing site files with this complete package.
3. No database migration is required for this display fix; V41 lifecycle migration remains required if it has not already been run.

Validation: JavaScript syntax and ZIP integrity checked locally. No live Supabase or mobile Safari test was performed.
