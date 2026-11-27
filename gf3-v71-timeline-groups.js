/* Garnish Farms V71
   Groups the existing strain-page timeline rows by physical container type.
   A jar stays in Jars and a grow bag stays in Bags regardless of lifecycle stage.
*/
(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  if (params.get('page') !== 'strain') return;

  const app = document.querySelector('#app');
  if (!app) return;

  function groupTimeline() {
    const root = app.querySelector('.strain-timeline');
    if (!root || root.dataset.groupedV71 === 'true') return;

    const rows = Array.from(root.querySelectorAll(':scope > .strain-timeline-row'));
    if (!rows.length) return;

    const snapshot = window.GF && window.GF.store && window.GF.store.current;
    const records = snapshot && Array.isArray(snapshot.containers)
      ? snapshot.containers : [];

    const byId = new Map();
    records.forEach(record => {
      if (record.itemId != null) byId.set(String(record.itemId), record);
      if (record.isLegacy && record.parentId != null) {
        byId.set('legacy-' + String(record.parentId), record);
      }
    });

    const groups = { jars: [], bags: [], other: [] };

    rows.forEach(row => {
      let id = '';
      try {
        id = new URL(row.getAttribute('href'), window.location.href)
          .searchParams.get('id') || '';
      } catch (_) {}

      const record = byId.get(String(id));
      const type = String(record && (record.container || record.container_type) || '')
        .trim().toLowerCase();

      let group;
      if (/jar/.test(type)) {
        group = 'jars';
      } else if (/bag|block/.test(type)) {
        group = 'bags';
      } else {
        // Legacy fallback only when the physical container field is unavailable.
        const stage = row.querySelector('.strain-timeline-name small')?.textContent || '';
        group = stage.includes('Grain Spawn') || stage.includes('🫙') ? 'jars' : 'bags';
      }
      groups[group].push(row);
    });

    const fragment = document.createDocumentFragment();
    ['jars', 'bags', 'other'].forEach(key => {
      if (!groups[key].length) return;

      const section = document.createElement('section');
      section.className = 'strain-timeline-group strain-timeline-group-' + key;

      const heading = document.createElement('h4');
      const label = document.createElement('span');
      label.textContent = key === 'jars' ? 'Jars' : key === 'bags' ? 'Bags' : 'Other containers';
      const count = document.createElement('small');
      count.textContent = String(groups[key].length);
      heading.append(label, count);

      const list = document.createElement('div');
      list.className = 'strain-timeline-group-rows';
      groups[key].forEach(row => list.append(row));
      section.append(heading, list);
      fragment.append(section);
    });

    root.replaceChildren(fragment);
    root.dataset.groupedV71 = 'true';
  }

  // The app renders asynchronously after Supabase data loads; observe the real render.
  const observer = new MutationObserver(() => {
    if (app.querySelector('.strain-timeline:not([data-grouped-v71="true"])')) {
      groupTimeline();
    }
  });
  observer.observe(app, { childList: true, subtree: true });
  groupTimeline();
})();
