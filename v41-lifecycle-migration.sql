-- Garnish Farms lifecycle migration (corrected for the uploaded production data)
-- Additive and non-destructive. Run once in Supabase SQL Editor after V36.
-- The uploaded batches export contains 35 parent rows representing 64 containers.
-- batch_id CH-161126-64 occurs twice (parent row IDs 8 and 9), so generated
-- child IDs for those two parent rows receive a -B<parent-row-id>- suffix.

begin;

alter table public.batches
  add column if not exists target_days jsonb not null
  default '{"Grain Spawn":14,"Bulk Substrate":14,"Fruiting":14}'::jsonb;

alter table public.batch_items
  add column if not exists grain_started_on date,
  add column if not exists bulk_started_on date,
  add column if not exists fruiting_started_on date,
  add column if not exists current_stage_started_on date,
  add column if not exists fruiting_method text,
  add column if not exists target_days jsonb not null
  default '{"Grain Spawn":14,"Bulk Substrate":14,"Fruiting":14}'::jsonb,
  add column if not exists target_overrides jsonb not null default '{}'::jsonb;

-- Materialize legacy parent-only rows into editable individual containers.
-- Keep duplicate parent rows separate. For ordinary unique batch IDs, retain
-- the familiar <batch_id>-<unit> format. For duplicate batch IDs, add the
-- parent numeric row ID to guarantee globally unique child container IDs.
insert into public.batch_items
  (batch_id, container_id, strain, date, stage, status, container,
   substrate, notes, stage_history)
select
  b.id,
  case
    when (select count(*) from public.batches b2 where b2.batch_id = b.batch_id) > 1
      then b.batch_id || '-B' || b.id::text || '-' || n.unit_no::text
    else b.batch_id || '-' || n.unit_no::text
  end,
  b.strain,
  b.date::date,
  coalesce(nullif(b.stage,''), 'Grain Spawn'),
  coalesce(nullif(b.status,''), 'Active'),
  coalesce(nullif(b.container,''),
    case
      when lower(coalesce(b.stage,'')) like '%fruit%'
        or lower(coalesce(b.stage,'')) like '%bulk%' then 'Bag'
      else 'Jar'
    end),
  b.substrate,
  b.notes,
  '[]'::jsonb
from public.batches b
cross join lateral generate_series(1, greatest(coalesce(b.quantity,1),1)) as n(unit_no)
where coalesce(b.batch_id,'') <> ''
  and not exists (
    select 1 from public.batch_items bi where bi.batch_id = b.id
  )
on conflict (container_id) do nothing;

-- Backfill only dates that are explicitly present in stage history, legacy
-- note tags, or the parent record's date for its current stage. Do not invent
-- earlier stage dates.
update public.batch_items bi
set
  grain_started_on = coalesce(
    bi.grain_started_on,
    (select nullif(e->>'date','')::date
       from jsonb_array_elements(coalesce(bi.stage_history,'[]'::jsonb)) e
      where lower(coalesce(e->>'stage','')) in ('grain spawn','grain','spawn')
        and coalesce(e->>'date','') ~ '^\d{4}-\d{2}-\d{2}'
      order by (e->>'date')::date asc limit 1),
    nullif(substring(coalesce(b.notes,'') from '\[Origin:(\d{4}-\d{2}-\d{2})\]'),'')::date,
    case when lower(coalesce(bi.stage,'')) in ('grain spawn','grain','spawn') then bi.date end
  ),
  bulk_started_on = coalesce(
    bi.bulk_started_on,
    (select nullif(e->>'date','')::date
       from jsonb_array_elements(coalesce(bi.stage_history,'[]'::jsonb)) e
      where lower(coalesce(e->>'stage','')) in ('bulk substrate','substrate','bulk')
        and coalesce(e->>'date','') ~ '^\d{4}-\d{2}-\d{2}'
      order by (e->>'date')::date asc limit 1),
    nullif(substring(coalesce(b.notes,'') from '\[Stage:SUB:(\d{4}-\d{2}-\d{2})\]'),'')::date,
    case when lower(coalesce(bi.stage,'')) in ('bulk substrate','substrate','bulk') then bi.date end
  ),
  fruiting_started_on = coalesce(
    bi.fruiting_started_on,
    (select nullif(e->>'date','')::date
       from jsonb_array_elements(coalesce(bi.stage_history,'[]'::jsonb)) e
      where lower(coalesce(e->>'stage','')) like '%fruit%'
        and coalesce(e->>'date','') ~ '^\d{4}-\d{2}-\d{2}'
      order by (e->>'date')::date asc limit 1),
    nullif(substring(coalesce(b.notes,'') from '\[Stage:FRT:(\d{4}-\d{2}-\d{2})\]'),'')::date,
    case when lower(coalesce(bi.stage,'')) like '%fruit%' then bi.date end
  ),
  target_days = coalesce(nullif(bi.target_days,'{}'::jsonb), b.target_days,
    '{"Grain Spawn":14,"Bulk Substrate":14,"Fruiting":14}'::jsonb)
from public.batches b
where b.id = bi.batch_id;

update public.batch_items
set current_stage_started_on = coalesce(
  current_stage_started_on,
  case
    when lower(coalesce(stage,'')) in ('grain spawn','grain','spawn') then grain_started_on
    when lower(coalesce(stage,'')) in ('bulk substrate','substrate','bulk') then bulk_started_on
    when lower(coalesce(stage,'')) like '%fruit%' then fruiting_started_on
    else date
  end
);

create index if not exists batch_items_status_stage_idx
  on public.batch_items(status, stage);
create index if not exists batch_items_batch_stage_idx
  on public.batch_items(batch_id, stage);

commit;

-- Verification: expected to show 64 child rows after migration for the
-- uploaded snapshot (63 Active + 1 Contaminated). Parent row count stays 35.
select
  (select count(*) from public.batches) as parent_batch_rows,
  (select count(*) from public.batch_items) as individual_container_rows,
  (select count(*) from public.batch_items where lower(coalesce(status,'')) = 'active') as active_containers,
  (select count(*) from public.batch_items where lower(coalesce(status,'')) = 'contaminated') as contaminated_containers;
