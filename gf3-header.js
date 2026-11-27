/* Garnish Farms shared header override.
   Loaded after gf3-ui.js and before gf3-app.js.
   All pages use the one GFUI.header() entry point in gf3-app.js. */
(() => {
  'use strict';

  const U = window.GFUI;
  if (!U) {
    console.error('Garnish Farms: GFUI must load before gf3-header.js');
    return;
  }

  const navItems = [
    ['Home', 'home'],
    ['All Batches', 'batches'],
    ['Jars', 'jars'],
    ['Bags', 'bags'],
    ['Fruiting', 'fruiting'],
    ['Upcoming', 'upcoming'],
    ['Calendar', 'calendar'],
    ['Yield', 'yield'],
    ['Cultures', 'cultures'],
    ['Activities', 'activities']
  ];

  const safe = U.esc;

  function header(data) {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'home';
    const selected = page === 'strain'
      ? (params.get('strain') || '')
      : (params.get('filter') || '');

    const pageHref = (target) => {
      const q = new URLSearchParams();
      q.set('page', target);
      if (selected) q.set('filter', selected);
      return 'index.html?' + q.toString();
    };

    const strainHref = (strain) => {
      const q = new URLSearchParams();
      if (page === 'strain') {
        q.set('page', 'strain');
        if (strain) q.set('strain', strain);
      } else {
        q.set('page', page);
        if (strain) q.set('filter', strain);
      }
      return 'index.html?' + q.toString();
    };

    const host = document.querySelector('#gf-header');
    if (!host) return;

    host.innerHTML = `
      <header class="site-header gf-static-header">
        <div class="gf-header-inner">
          <div class="gf-brand">
            <a class="brand-home-link" href="${U.href('home')}" aria-label="Garnish Farms home">
              <h1>Garnish Farms <span>– Mushrooms</span></h1>
            </a>
            <div class="gf-sync-line">
              <i class="dot" aria-hidden="true"></i>
              <span>Cloud Synced</span>
              <span class="gf-sync-separator">·</span>
              <a href="#" id="signout">Sign out</a>
            </div>
          </div>
          <a class="btn outline gf-settings-link" href="${U.href('settings')}">Settings</a>
        </div>
      </header>

      <div class="gf-shared-navigation">
        <nav class="page-nav gf-page-nav" aria-label="Main navigation">
          ${navItems.map(([label, key]) => `
            <a class="${page === key ? 'active' : ''}"
               href="${pageHref(key)}"
               ${page === key ? 'aria-current="page"' : ''}>${label}</a>
          `).join('')}
        </nav>

        <nav class="strain-nav gf-strain-nav" aria-label="Filter by strain">
          <a class="strain-filter-all ${selected ? '' : 'active'}"
             href="${strainHref('')}"
             ${selected ? '' : 'aria-current="true"'}>All Strains</a>
          ${U.strains.map(([name, color, tint]) => `
            <a class="${selected === name ? 'active' : ''}"
               style="--c:${color};--bgc:${tint}"
               href="${strainHref(name)}"
               ${selected === name ? 'aria-current="true"' : ''}>${safe(name)}</a>
          `).join('')}
        </nav>
      </div>
    `;

    const signout = document.querySelector('#signout');
    if (signout) {
      signout.addEventListener('click', async (event) => {
        event.preventDefault();
        await window.GF.auth.signOut();
        window.location.replace('login.html');
      });
    }
  }

  U.header = header;
})();
