GARNISH FARMS DASHBOARD — GLOBAL FOUNDATION V5

Purpose
Centralize individual-container lifecycle writes and clarify the lifecycle data contract.

Changes
- Added repositories.items.saveLifecycle(item, changes, options) as the single write path for stage transitions and lifecycle date corrections.
- The service updates the current stage, current-stage start date, stage-specific date projection, status/container defaults, and stage_history together in one Supabase update.
- Stage transitions append a typed stage_transition event. Corrections to an existing stage date append a typed stage_date_correction event with the previous date.
- The batch detail page now uses this lifecycle service for both the Advance action and Save edits, avoiding duplicate transition logic and duplicate history events.
- The individual-container timeline now prefers the explicit lifecycle date columns; stage_history is used as a compatibility fallback only when a date projection is absent. This prevents an older event date from overriding a corrected date.
- Existing legacy parent-note date tags remain readable for compatibility. They are not deleted or rewritten in this release.

Lifecycle data contract
- batch_items.stage is the current stage.
- batch_items.current_stage_started_on is the start date for the current stage.
- grain_started_on, bulk_started_on, and fruiting_started_on are the current date projections for each stage.
- batch_items.stage_history is the audit/event trail, including stage transitions and date corrections.
- Legacy [Origin:], [Stage:SUB:], and [Stage:FRT:] tags in parent notes remain fallback inputs for older records until a separately reviewed backfill is complete.

Safety
- No live database schema, policy, or production record was changed.
- No migration was executed.
- Harvest table is still absent from the last verified Supabase schema; harvest migration remains review-only.

Verification
- All inline scripts in dashboard HTML pages were syntax-checked with Node.js.
- Shared JavaScript files were syntax-checked.
- ZIP integrity was checked.
- No authenticated browser workflow was run; the lifecycle update still requires testing against the signed-in account.
