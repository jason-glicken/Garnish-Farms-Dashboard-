/* Garnish Farms shared site header — one markup, one stylesheet, one data loader */
(() => {
  'use strict';
  if (window.__GF_SHARED_HEADER__) return;
  window.__GF_SHARED_HEADER__ = true;
  const ROOT = new URL('.', document.currentScript.src);
  const mount = document.getElementById('gf-shared-header');
  if (!mount) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('shared-header.css?v=1', ROOT).href;
  document.head.appendChild(link);

  const setStatus = (state, message) => {
    const dot = document.getElementById('syncDot');
    const label = document.getElementById('syncStatus');
    if (dot) {
      dot.className = 'sync-dot ' + state;
      dot.style.setProperty('background-color', state === 'connected' ? '#16a34a' : state === 'error' ? '#dc2626' : '#9ca3af', 'important');
    }
    if (label) label.textContent = message;
  };
  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value);
  };
  function setActiveNavigation() {
    const file = location.pathname.split('/').pop() || 'index.html';
    const params = new URLSearchParams(location.search);
    const type = (params.get('type') || '').toLowerCase();
    document.querySelectorAll('#gf-shared-header a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href === 'list.html?type=all' && (file === 'batch.html' || (file === 'list.html' && type === 'all'))) a.classList.add('gf-active');
      if (href === 'list.html?type=jars' && file === 'list.html' && type === 'jars') a.classList.add('gf-active');
      if (href === 'list.html?type=bags' && file === 'list.html' && type === 'bags') a.classList.add('gf-active');
      if (href === 'list.html?type=fruiting' && file === 'list.html' && type === 'fruiting') a.classList.add('gf-active');
      if (href === 'new-batch.html' && file === 'new-batch.html') a.classList.add('gf-active');
      if (href === 'harvest.html' && file === 'harvest.html') a.classList.add('gf-active');
      if (href === 'yield.html' && file === 'yield.html') a.classList.add('gf-active');
      if (href === 'settings.html' && file === 'settings.html') a.classList.add('gf-active');
      if (href.startsWith('strain.html?strain=') && file === 'strain.html' && decodeURIComponent(href.split('strain=')[1] || '') === (params.get('strain') || '')) a.classList.add('gf-strain-active');
    });
  }
  async function ensureSupabase() {
    if (window.supabase && typeof window.supabase.createClient === 'function') return;
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Supabase library failed to load'));
      document.head.appendChild(script);
    });
  }
  async function refreshHeader() {
    setStatus('', 'Syncing...');
    try {
      await ensureSupabase();
      const client = window.supabase.createClient('https://odtalucpwmxcydxbypke.supabase.co', 'sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm');
      const { data, error } = await client.from('batches').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      const batches = Array.isArray(data) ? data : [];
      const norm = value => String(value || '').trim().toLowerCase();
      const active = batches.filter(b => !['inactive','harvested','contaminated','archived','discarded','deleted'].includes(norm(b.status)));
      const sum = rows => rows.reduce((total, b) => total + Number(b.quantity || 0), 0);
      const jars = sum(active.filter(b => b.container === 'Jar' && b.stage !== 'Fruiting'));
      const bags = sum(active.filter(b => b.container === 'Bag' && b.stage !== 'Fruiting'));
      const fruiting = sum(active.filter(b => b.stage === 'Fruiting'));
      const yieldLbs = batches.reduce((total, b) => total + Number(b.harvest_weight || 0), 0);
      setText('kpi-active', batches.length);
      setText('kpi-jars', jars);
      setText('kpi-bags', bags);
      setText('kpi-fruiting', fruiting);
      setText('header-total-farm-yield-val', yieldLbs.toFixed(1) + ' lbs');
      setStatus(batches.length ? 'connected' : '', batches.length ? `Cloud Synced · ${batches.length} batches` : 'Connected · No batch records returned');
    } catch (error) {
      console.error('Garnish Farms shared header sync:', error);
      setStatus('error', 'Sync Error: ' + (error && error.message ? error.message : 'Unable to connect'));
    }
  }
  async function init() {
    try {
      const response = await fetch(new URL('shared-header.html?v=1', ROOT), { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load shared-header.html (' + response.status + ')');
      mount.innerHTML = await response.text();
      setActiveNavigation();
      document.dispatchEvent(new CustomEvent('gf:shared-header-ready'));
      await refreshHeader();
    } catch (error) {
      console.error('Garnish Farms shared header failed:', error);
      mount.textContent = 'Garnish Farms header could not load: ' + error.message;
    }
  }
  init();
})();
