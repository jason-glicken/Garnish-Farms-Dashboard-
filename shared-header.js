/* Garnish Farms global layout loader and shared header controller. */
(() => {
  'use strict';
  if (window.__GF_LAYOUT_LOADED__) return;
  const mount = document.getElementById('gf-shared-header');
  if (!mount) return;
  window.__GF_LAYOUT_LOADED__ = true;
  const base = new URL('.', document.currentScript.src);
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('shared-header.css?v=2', base).href;
  document.head.appendChild(css);

  const status = (state, message) => {
    const dot = document.getElementById('syncDot');
    const label = document.getElementById('syncStatus');
    if (dot) dot.className = 'sync-dot ' + state;
    if (label) label.textContent = message;
  };
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value);
  };
  const norm = value => window.GFData.normalize(value);
  const active = row => window.GFData.isActive(row);
  const stage = row => window.GFData.stage(row);

  function markActiveLinks() {
    const file = location.pathname.split('/').pop() || 'index.html';
    const params = new URLSearchParams(location.search);
    const type = (params.get('type') || '').toLowerCase();
    const strain = (params.get('strain') || '').toLowerCase();
    mount.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if ((href === 'list.html?type=all' && (file === 'batch.html' || (file === 'list.html' && type === 'all'))) ||
          (href === 'list.html?type=jars' && file === 'list.html' && type === 'jars') ||
          (href === 'list.html?type=bags' && file === 'list.html' && type === 'bags') ||
          (href === 'list.html?type=fruiting' && file === 'list.html' && type === 'fruiting') ||
          (href === file && ['index.html','new-batch.html','harvest.html','yield.html','settings.html','upcoming.html','activities.html','new-culture.html'].includes(file))) {
        a.classList.add('gf-active');
      }
      if (a.hasAttribute('data-strain')) {
        const name = a.getAttribute('data-strain') || '';
        if (strain && strain === name.toLowerCase()) a.classList.add('gf-strain-active');
        if (file === 'list.html') a.href = `list.html?type=${encodeURIComponent(type || 'jars')}&strain=${encodeURIComponent(name)}`;
        if (file === 'strain.html') a.href = `strain.html?strain=${encodeURIComponent(name)}`;
      }
    });
  }

  async function refreshHeader() {
    if (!window.GFData) throw new Error('Shared database layer did not initialize');
    status('', 'Checking sign-in…');
    const auth = await window.GFData.getAuthState();
    if (auth.error) throw auth.error;
    if (!auth.authenticated) {
      const error = new Error('No active Supabase user session. Database access requires signing in.');
      error.code = 'GF_AUTH_REQUIRED';
      throw error;
    }
    status('', 'Syncing…');
    const [snapshot, harvestResult] = await Promise.all([
      window.GFData.getProductionSnapshot({ orderBy: 'created_at' }),
      window.GFData.getHarvests({ columns: 'weight_lbs', orderBy: false })
    ]);
    const parents = snapshot.parents || [];
    const units = (snapshot.containers || []).filter(active);
    const jars = units.filter(row => stage(row) === 'Grain Spawn').length;
    const bags = units.filter(row => stage(row) === 'Bulk Substrate').length;
    const fruiting = units.filter(row => stage(row) === 'Fruiting').length;
    const activeParents = new Set(units.map(row => String(row.parentId ?? row.batch_id ?? row.id))).size;
    set('kpi-active', activeParents);
    set('kpi-jars', jars);
    set('kpi-bags', bags);
    set('kpi-fruiting', fruiting);
    if (harvestResult.error) {
      set('header-total-farm-yield-val', '—');
      status('error', 'Cloud Connected · harvest log setup required');
      console.warn('Harvest table unavailable; header yield intentionally not shown.', harvestResult.error);
    } else {
      const total = (harvestResult.data || []).reduce((sum, row) => sum + (Number(row.weight_lbs) || 0), 0);
      set('header-total-farm-yield-val', total.toFixed(2) + ' lbs');
      status('connected', 'Cloud Connected · ' + parents.length + ' batches');
    }
  }

  async function init() {
    try {
      const response = await fetch(new URL('shared-header.html?v=2', base), { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load shared header (' + response.status + ')');
      mount.innerHTML = await response.text();
      const signOutButton = document.getElementById('gfSignOut');
      if (signOutButton) signOutButton.addEventListener('click', async () => {
        signOutButton.disabled = true; signOutButton.textContent = 'Signing out…';
        const result = await window.GFData.signOut();
        if (result.error) { signOutButton.disabled = false; signOutButton.textContent = 'Sign out'; alert('Could not sign out: ' + result.error.message); return; }
        location.replace(new URL('login.html', base).href);
      });
      markActiveLinks();
      document.dispatchEvent(new CustomEvent('gf:shared-header-ready'));
      await refreshHeader();
    } catch (error) {
      console.error('Garnish Farms global layout:', error);
      status('error', error && error.code === 'GF_AUTH_REQUIRED' ? 'Sign-in required' : 'Sync unavailable');
    }
  }
  init();
  if (window.GFData && typeof window.GFData.onAuthStateChange === 'function') {
    window.GFData.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        refreshHeader().catch(error => {
          console.error('Garnish Farms header refresh after auth change:', error);
          status('error', error && error.code === 'GF_AUTH_REQUIRED' ? 'Sign-in required' : 'Sync unavailable');
        });
      }
    });
  }
})();
