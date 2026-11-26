/* Garnish Farms — shared header sync, aligned with the working Home/List query */
(() => {
  'use strict';
  if (window.__gfSharedHeaderSyncInstalled) return;
  window.__gfSharedHeaderSyncInstalled = true;

  const URL = 'https://odtalucpwmxcydxbypke.supabase.co';
  const KEY = 'sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';
  const $ = id => document.getElementById(id);
  const text = (id, value) => { const el = $(id); if (el) el.textContent = String(value); };
  const sync = (state, message) => {
    const dot = $('syncDot'), label = $('syncStatus');
    if (dot) {
      dot.className = 'sync-dot' + (state ? ' ' + state : '');
      dot.style.setProperty('background-color',
        state === 'connected' ? '#16a34a' : state === 'error' ? '#dc2626' : '#9ca3af',
        'important');
    }
    if (label) label.textContent = message;
  };

  async function run() {
    sync('', 'Cloud Sync · Checking…');
    try {
      // The CDN exposes the same `supabase.createClient` used by the page scripts.
      if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        throw new Error('Supabase client library unavailable');
      }
      const client = window.supabase.createClient(URL, KEY);
      const result = await client.from('batches').select('*').order('created_at', { ascending: false });
      if (result.error) throw result.error;
      const batches = Array.isArray(result.data) ? result.data : [];
      const active = batches.filter(b => {
        const s = String(b.status || 'Active').trim().toLowerCase();
        return !['inactive','archived','discarded','deleted','contaminated','harvested'].includes(s);
      });
      const sum = rows => rows.reduce((n,b) => n + (Number(b.quantity) || 0), 0);
      const jars = sum(active.filter(b => String(b.container || '').toLowerCase() === 'jar' && String(b.stage || '').toLowerCase() !== 'fruiting'));
      const bags = sum(active.filter(b => String(b.container || '').toLowerCase() === 'bag' && String(b.stage || '').toLowerCase() !== 'fruiting'));
      const fruiting = sum(active.filter(b => String(b.stage || '').toLowerCase() === 'fruiting'));
      text('kpi-active', batches.length);
      text('kpi-jars', jars);
      text('kpi-bags', bags);
      text('kpi-fruiting', fruiting);
      sync(batches.length ? 'connected' : '', batches.length ? `Cloud Synced · ${batches.length} batches` : 'Connected · No batches');
    } catch (err) {
      console.error('Shared header sync:', err);
      sync('error', 'Cloud Sync Error');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
