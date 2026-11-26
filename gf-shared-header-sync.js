/* Garnish Farms — shared header sync (Home-compatible)
   Non-Home pages only. Uses the same single batches query and KPI rules as
   index.html. Optional batch_items/harvests queries are intentionally excluded
   so a missing optional table/column cannot turn a valid batch sync red. */
(() => {
  'use strict';
  if (window.__gfSharedHeaderSyncInstalled) return;
  window.__gfSharedHeaderSyncInstalled = true;

  const SUPABASE_URL = 'https://odtalucpwmxcydxbypke.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';

  const byId = id => document.getElementById(id);
  const put = (id, value) => {
    const el = byId(id);
    if (el) el.textContent = String(value);
  };
  const setSync = (state, message) => {
    const dot = byId('syncDot');
    const label = byId('syncStatus');
    if (dot) {
      dot.className = 'sync-dot' + (state ? ' ' + state : '');
      dot.style.removeProperty('background');
      dot.style.removeProperty('background-color');
    }
    if (label) label.textContent = message;
  };
  const norm = value => String(value == null ? '' : value)
    .trim().toLowerCase().replace(/[\s_-]+/g, ' ');
  const isActive = batch => {
    const status = norm(batch && batch.status);
    return !['inactive', 'harvested', 'contaminated',
             'archived', 'discarded', 'deleted'].includes(status);
  };

  async function refreshHeader() {
    setSync('', 'Syncing...');
    try {
      // Use the same client library, project, table, and select pattern as Home.
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await client
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!Array.isArray(data)) throw new Error('Batch query returned no data array');

      const batches = data;
      const active = batches.filter(isActive);
      const jars = active
        .filter(b => b.container === 'Jar' && b.stage !== 'Fruiting')
        .reduce((sum, b) => sum + Number(b.quantity || 0), 0);
      const bags = active
        .filter(b => b.container === 'Bag' && b.stage !== 'Fruiting')
        .reduce((sum, b) => sum + Number(b.quantity || 0), 0);
      const fruiting = active
        .filter(b => b.stage === 'Fruiting')
        .reduce((sum, b) => sum + Number(b.quantity || 0), 0);
      const totalYield = batches
        .reduce((sum, b) => sum + Number(b.harvest_weight || 0), 0);

      put('kpi-active', batches.length);
      put('kpi-jars', jars);
      put('kpi-bags', bags);
      put('kpi-fruiting', fruiting);
      put('kpi-yield', totalYield.toFixed(1));
      put('header-total-farm-yield-val', totalYield.toFixed(1) + ' lbs');

      setSync(
        batches.length > 0 ? 'connected' : '',
        batches.length > 0
          ? 'Cloud Synced · ' + batches.length + ' batches'
          : 'Connected · No batch records returned'
      );
    } catch (error) {
      console.error('Garnish Farms shared header sync failed:', error);
      const message = error && error.message ? error.message : 'Sync Error';
      setSync('error', 'Sync Error: ' + message);
    }
  }

  function start() {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      setSync('error', 'Sync Error: Supabase library unavailable');
      return;
    }
    refreshHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
