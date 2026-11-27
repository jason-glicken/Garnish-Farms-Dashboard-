/* Garnish Farms V69 — separate physical container lists.
   Container type takes precedence over lifecycle stage, so a bag currently in
   Grain Spawn does not appear in Jars, and a jar later moved to substrate does
   not appear in Bags. Older records without a container type use stage as a
   safe fallback. */
(() => {
  'use strict';
  const ui = window.GFUI;
  if (!ui || typeof ui.cards !== 'function') return;

  const originalCards = ui.cards.bind(ui);
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || 'home';

  function belongsToPage(record, target) {
    const type = String(record.container || '').trim().toLowerCase();
    const stage = String(record.stage || record.current_stage || '').trim().toLowerCase();

    if (type) {
      if (target === 'jars') return type.includes('jar');
      if (target === 'bags') return type.includes('bag') || type.includes('block');
    }

    // Legacy records may not have a physical container field populated.
    if (target === 'jars') return stage === 'grain spawn';
    if (target === 'bags') return stage === 'bulk substrate';
    return true;
  }

  if (page === 'jars' || page === 'bags') {
    ui.cards = rows => originalCards(rows.filter(row => belongsToPage(row, page)));

    // Correct the record count in the page heading after the filtered cards render.
    const app = document.querySelector('#app');
    if (app && typeof MutationObserver !== 'undefined') {
      const updateCount = () => {
        const title = app.querySelector('.page-title p');
        const count = app.querySelectorAll('.records > .record').length;
        if (title && title.textContent !== `${count} active records`) title.textContent = `${count} active records`;
      };
      const observer = new MutationObserver(updateCount);
      observer.observe(app, { childList: true, subtree: true });
      updateCount();
    }
  }
})();
