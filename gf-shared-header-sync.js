/* Garnish Farms — shared header sync
   Loaded at the end of each HTML page. Keeps header inventory and sync state
   consistent without replacing that page's own production-page data loader. */
(() => {
  'use strict';
  if (window.__gfSharedHeaderSyncInstalled) return;
  window.__gfSharedHeaderSyncInstalled = true;

  const SUPABASE_URL = 'https://odtalucpwmxcydxbypke.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';

  const byId = id => document.getElementById(id);
  const setText = (id, value) => {
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
    .trim().toLowerCase().replace(/[’']/g, "'")
    .replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  const isActive = status => norm(status || 'Active') === 'active';

  async function refreshSharedHeader() {
    setSync('', 'Cloud Sync · Checking…');
    try {
      if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        throw new Error('Supabase client library is not available on this page.');
      }
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const [parentsResult, childrenResult, harvestsResult] = await Promise.all([
        client.from('batches').select('id,quantity,container,stage,status'),
        client.from('batch_items').select('id,batch_id,container_id,container,stage,status'),
        client.from('harvests').select('weight_lbs')
      ]);
      if (parentsResult.error) throw parentsResult.error;
      if (childrenResult.error) throw childrenResult.error;
      if (harvestsResult.error) throw harvestsResult.error;

      const parents = parentsResult.data || [];
      const children = childrenResult.data || [];
      const harvests = harvestsResult.data || [];
      const childParentIds = new Set(children.map(item => String(item.batch_id)));
      const units = [];

      children.forEach(item => {
        if (isActive(item.status)) units.push(item);
      });
      parents
        .filter(parent => !childParentIds.has(String(parent.id)) && isActive(parent.status))
        .forEach(parent => {
          const count = Math.max(1, Number(parent.quantity) || 1);
          for (let i = 0; i < count; i++) {
            units.push({
              batch_id: parent.id,
              stage: parent.stage,
              status: parent.status,
              container: parent.container
            });
          }
        });

      const jars = units.filter(item => norm(item.stage) === 'grain spawn').length;
      const bags = units.filter(item => norm(item.stage) === 'bulk substrate').length;
      const fruiting = units.filter(item => norm(item.stage) === 'fruiting').length;
      const batchCount = new Set(units.map(item => String(item.batch_id || item.id || ''))).size;
      const totalYield = harvests.reduce((sum, row) => sum + (Number(row.weight_lbs) || 0), 0);

      setText('kpi-active', batchCount);
      setText('kpi-jars', jars);
      setText('kpi-bags', bags);
      setText('kpi-fruiting', fruiting);
      setText('header-total-farm-yield-val', totalYield.toFixed(2) + ' lbs');

      if (parents.length || children.length) {
        setSync('connected', 'Cloud Synced · ' + batchCount + ' batches');
      } else {
        setSync('', 'Connected · No production records returned');
      }
    } catch (error) {
      console.error('Garnish Farms shared header sync failed:', error);
      setSync('error', 'Cloud Sync Error');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshSharedHeader, { once: true });
  } else {
    refreshSharedHeader();
  }
})();
