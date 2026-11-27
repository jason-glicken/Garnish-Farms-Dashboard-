/* Require an existing Supabase Auth session before page data handlers run. */
(() => {
  'use strict';
  if (location.pathname.endsWith('/login.html') || location.pathname === 'login.html') return;
  let replaying = false;
  document.addEventListener('DOMContentLoaded', async event => {
    if (replaying) return;
    event.stopImmediatePropagation();
    event.stopPropagation();
    try {
      const auth = await window.GFData.getAuthState();
      if (!auth.authenticated) {
        const next = location.pathname + location.search + location.hash;
        location.replace(new URL('login.html?next=' + encodeURIComponent(next), location.href).href);
        return;
      }
      replaying = true;
      document.dispatchEvent(new Event('DOMContentLoaded'));
    } catch (error) {
      console.error('Garnish Farms authentication check failed:', error);
      location.replace(new URL('login.html', location.href).href);
    }
  }, true);
})();
