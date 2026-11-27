/* Garnish Farms shared database foundation. One client per browser page. */
(() => {
  'use strict';
  if (window.GFData) return;
  const SUPABASE_URL = 'https://odtalucpwmxcydxbypke.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Garnish Farms: Supabase library must load before gf-data.js');
    return;
  }
  const client = window.__GF_SUPABASE__ || window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.__GF_SUPABASE__ = client;
  const cache = new Map();
  // Supabase Auth uses the existing account; this dashboard never creates users.
  async function getAuthState() {
    if (!client.auth || typeof client.auth.getSession !== 'function') {
      return { authenticated: false, session: null, error: new Error('Supabase Auth is unavailable in this browser session.') };
    }
    const { data, error } = await client.auth.getSession();
    if (error) return { authenticated: false, session: null, error };
    return { authenticated: !!data?.session?.user, session: data?.session || null, error: null };
  }
  async function signInWithPassword(email, password) {
    return client.auth.signInWithPassword({ email: String(email || '').trim(), password: String(password || '') });
  }
  async function signOut() { return client.auth.signOut(); }
  function getCurrentUser() { return client.auth.getUser(); }
  function onAuthStateChange(callback) {
    if (!client.auth || typeof client.auth.onAuthStateChange !== 'function') return { data: { subscription: { unsubscribe() {} } } };
    return client.auth.onAuthStateChange(callback);
  }
  const norm = value => String(value ?? '').trim().toLowerCase().replace(/[’']/g, "'").replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  function read(table, configure, options = {}) {
    const key = table + ':' + (options.cacheKey || 'default');
    if (!options.fresh && cache.has(key)) return cache.get(key);
    const promise = (async () => {
      let query = client.from(table).select('*');
      if (typeof configure === 'function') query = configure(query);
      const { data, error } = await query;
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    })();
    if (!options.fresh) cache.set(key, promise);
    return promise.catch(error => { cache.delete(key); throw error; });
  }
  function invalidate(table) {
    if (table) { for (const key of cache.keys()) if (key.startsWith(table + ':')) cache.delete(key); }
    else cache.clear();
  }
  // Domain service for harvest history. No localStorage fallback: Supabase is authoritative.
  async function getHarvests(options = {}) {
    let query = client.from('harvests').select(options.columns || '*');
    if (options.orderBy !== false) query = query.order(options.orderBy || 'harvest_date', { ascending: !!options.ascending });
    if (Number.isInteger(options.limit) && options.limit > 0) query = query.limit(options.limit);
    const result = await query;
    return result;
  }
  async function insertHarvest(entry) {
    const result = await client.from('harvests').insert([entry]).select().single();
    if (!result.error) invalidate('harvests');
    return result;
  }
  async function updateBatch(id, changes) {
    const result = await client.from('batches').update(changes).eq('id', id).select().single();
    if (!result.error) invalidate('batches');
    return result;
  }
  async function getBatches(options = {}) {
    let query = client.from('batches').select(options.columns || '*');
    if (options.orderBy) query = query.order(options.orderBy, { ascending: !!options.ascending });
    if (Number.isInteger(options.limit) && options.limit > 0) query = query.limit(options.limit);
    return query;
  }
  async function getBatchItems(options = {}) {
    let query = client.from('batch_items').select(options.columns || '*');
    if (options.orderBy) query = query.order(options.orderBy, { ascending: !!options.ascending });
    return query;
  }
  async function getCultures(options = {}) {
    let query = client.from('cultures').select(options.columns || '*');
    if (options.orderBy) query = query.order(options.orderBy, { ascending: !!options.ascending });
    return query;
  }
  // Canonical repositories: page code calls these methods instead of composing table queries.
  // Each write invalidates the affected read cache only after a successful response.
  const filters = (query, where = {}) => Object.entries(where || {}).reduce((q, [key, value]) => value === undefined ? q : q.eq(key, value), query);
  async function listBatches(options = {}) {
    let q = filters(client.from('batches').select(options.columns || '*'), options.where);
    if (options.orderBy) q = q.order(options.orderBy, { ascending: !!options.ascending });
    if (Number.isInteger(options.limit) && options.limit > 0) q = q.limit(options.limit);
    return q;
  }
  async function getBatch(id) { return client.from('batches').select('*').eq('id', id).single(); }
  async function createBatch(payload) {
    const result = await client.from('batches').insert([payload]).select('*').single();
    if (!result.error) invalidate('batches');
    return result;
  }
  async function updateBatchRecord(id, changes) {
    const result = await client.from('batches').update(changes).eq('id', id).select('*').maybeSingle();
    if (!result.error) invalidate('batches');
    return result;
  }
  async function deleteBatch(id) {
    const result = await client.from('batches').delete().eq('id', id);
    if (!result.error) invalidate('batches');
    return result;
  }
  async function listBatchItems(options = {}) {
    let q = filters(client.from('batch_items').select(options.columns || '*'), options.where);
    if (options.orderBy) q = q.order(options.orderBy, { ascending: !!options.ascending });
    if (Number.isInteger(options.limit) && options.limit > 0) q = q.limit(options.limit);
    return q;
  }
  async function createBatchItems(rows) {
    const result = await client.from('batch_items').insert(Array.isArray(rows) ? rows : [rows]).select('*');
    if (!result.error) invalidate('batch_items');
    return result;
  }
  async function updateBatchItem(id, changes) {
    const result = await client.from('batch_items').update(changes).eq('id', id).select('*').maybeSingle();
    if (!result.error) invalidate('batch_items');
    return result;
  }
  async function deleteBatchItem(id) {
    const result = await client.from('batch_items').delete().eq('id', id);
    if (!result.error) invalidate('batch_items');
    return result;
  }

  // Canonical lifecycle writer. stage_history is the append-only event record;
  // lifecycle date columns are indexed/current projections used by timelines.
  const STAGE_DATE_FIELDS = Object.freeze({
    'Grain Spawn': 'grain_started_on',
    'Bulk Substrate': 'bulk_started_on',
    'Fruiting': 'fruiting_started_on'
  });
  async function saveItemLifecycle(item, changes = {}, options = {}) {
    if (!item || item.id == null) return { data: null, error: new Error('A persisted container is required for lifecycle updates.') };
    const patch = { ...changes };
    const history = Array.isArray(item.stage_history) ? item.stage_history.slice() : [];
    const oldStage = item.stage || 'Grain Spawn';
    const nextStage = patch.stage || oldStage;
    const dateNow = options.date || new Date().toISOString().slice(0, 10);
    const recordedAt = new Date().toISOString();

    if (nextStage !== oldStage) {
      const field = STAGE_DATE_FIELDS[nextStage];
      const transitionDate = (field && patch[field]) || dateNow;
      if (field) patch[field] = transitionDate;
      patch.current_stage_started_on = transitionDate;
      if (nextStage === 'Bulk Substrate' || nextStage === 'Fruiting') patch.container = 'Bag';
      if (nextStage === 'Harvested') patch.status = 'Harvested';
      else if (!patch.status || patch.status === 'Harvested' || item.status === 'Harvested') patch.status = 'Active';
      history.push({ type: 'stage_transition', from: oldStage, stage: nextStage, date: transitionDate, recorded_at: recordedAt });
    }

    for (const [stage, field] of Object.entries(STAGE_DATE_FIELDS)) {
      if (!Object.prototype.hasOwnProperty.call(patch, field)) continue;
      const nextDate = patch[field] || null;
      const previousDate = item[field] || null;
      if (nextDate && nextDate !== previousDate && nextStage === stage && nextStage === oldStage) {
        patch.current_stage_started_on = nextDate;
      }
      if (nextDate !== previousDate && previousDate !== null && !(nextStage !== oldStage && nextStage === stage)) {
        history.push({ type: 'stage_date_correction', stage, date: nextDate, previous_date: previousDate, recorded_at: recordedAt });
      }
    }
    if (history.length || Object.keys(patch).some(k => STAGE_DATE_FIELDS[k])) patch.stage_history = history;
    const result = await client.from('batch_items').update(patch).eq('id', item.id).select('*').maybeSingle();
    if (!result.error) invalidate('batch_items');
    return result;
  }
  async function listCultures(options = {}) {
    let q = filters(client.from('cultures').select(options.columns || '*'), options.where);
    if (options.orderBy) q = q.order(options.orderBy, { ascending: !!options.ascending });
    if (Number.isInteger(options.limit) && options.limit > 0) q = q.limit(options.limit);
    return q;
  }
  async function createCulture(payload) {
    const result = await client.from('cultures').insert([payload]);
    if (!result.error) invalidate('cultures');
    return result;
  }
  async function deleteCulture(id) {
    const result = await client.from('cultures').delete().eq('id', id);
    if (!result.error) invalidate('cultures');
    return result;
  }
  async function createBatchWithItems(parentPayload, itemRows) {
    const parentResult = await createBatch(parentPayload);
    if (parentResult.error) return parentResult;
    const childRows = (Array.isArray(itemRows) ? itemRows : []).map(row => ({ ...row, batch_id: parentResult.data.id }));
    if (!childRows.length) return parentResult;
    const childResult = await createBatchItems(childRows);
    if (!childResult.error) return { data: { ...parentResult.data, items: childResult.data }, error: null };
    // Best-effort rollback: never leave an empty parent when child creation fails.
    const rollback = await deleteBatch(parentResult.data.id);
    return { data: null, error: Object.assign(new Error(`Container creation failed: ${childResult.error.message || childResult.error}. Parent rollback ${rollback.error ? 'also failed: ' + rollback.error.message : 'succeeded'}.`), { cause: childResult.error, rollbackError: rollback.error || null }) };
  }
  function isActive(row) { return !['inactive','harvested','contaminated','archived','discarded','deleted'].includes(norm(row?.status)); }
  function stage(row) {
    const value = norm(row?.stage), container = norm(row?.container);
    if (value.includes('fruit') || container.includes('fruit')) return 'Fruiting';
    if (value.includes('bulk') || value.includes('substrate') || container.includes('bag') || container.includes('block')) return 'Bulk Substrate';
    return 'Grain Spawn';
  }
  window.GFData = Object.freeze({ ready: true, getAuthState, onAuthStateChange, signInWithPassword, signOut, getCurrentUser, read, invalidate, getHarvests, insertHarvest, updateBatch, getBatches, getBatchItems, getCultures, repositories: Object.freeze({ batches: Object.freeze({ list: listBatches, get: getBatch, create: createBatch, update: updateBatchRecord, remove: deleteBatch, createWithItems: createBatchWithItems }), items: Object.freeze({ list: listBatchItems, create: createBatchItems, update: updateBatchItem, saveLifecycle: saveItemLifecycle, remove: deleteBatchItem }), cultures: Object.freeze({ list: listCultures, create: createCulture, remove: deleteCulture }), harvests: Object.freeze({ list: getHarvests, create: insertHarvest }) }), isActive, stage, normalize: norm, project: Object.freeze({ url: SUPABASE_URL }) });
})();
