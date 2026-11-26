/* Garnish Farms owner authentication gate. Uses one persistent Supabase client per browser origin. */
(() => {
  'use strict';
  const URL = 'https://odtalucpwmxcydxbypke.supabase.co';
  const KEY = 'sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';
  const LOGIN = 'login.html';
  const OWNER_EMAIL = 'jason.glicken@gmail.com';
  const isLogin = /(^|\/)login\.html$/.test(location.pathname);
  document.documentElement.classList.add('gf-auth-pending');
  const style = document.createElement('style');
  style.textContent = 'html.gf-auth-pending body{visibility:hidden!important}';
  document.head.appendChild(style);
  if (!window.supabase?.createClient) {
    document.documentElement.classList.remove('gf-auth-pending');
    console.error('Garnish Farms authentication could not load Supabase.');
    return;
  }
  const db = window.__GF_SUPABASE__ ||= window.supabase.createClient(URL, KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.__GF_SUPABASE__ = db;
  window.GFAuth = {
    client: db,
    async signOut() { await db.auth.signOut(); location.replace(LOGIN); }
  };
  const reveal = () => document.documentElement.classList.remove('gf-auth-pending');
  const safeNext = value => {
    const candidate = String(value || 'index.html');
    if (!candidate || candidate.startsWith('/') || candidate.startsWith('\\') || candidate.includes('://') || candidate.startsWith('//')) return 'index.html';
    return candidate;
  };
  const goLogin = () => {
    const next = safeNext(location.pathname.split('/').pop() + location.search + location.hash);
    location.replace(LOGIN + '?next=' + encodeURIComponent(next));
  };
  db.auth.getSession().then(({ data, error }) => {
    if (error) console.warn('Session check:', error.message);
    const session = data?.session;
    if (isLogin) {
      if (session?.user?.email?.toLowerCase() === OWNER_EMAIL) {
        const next = safeNext(new URLSearchParams(location.search).get('next'));
        location.replace(next);
        return;
      }
      reveal();
      return;
    }
    if (!session || session.user?.email?.toLowerCase() !== OWNER_EMAIL) {
      if (session) db.auth.signOut().finally(goLogin); else goLogin();
      return;
    }
    reveal();
  }).catch(err => {
    console.error('Unable to verify Garnish Farms session:', err);
    if (!isLogin) goLogin(); else reveal();
  });
  db.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' && !isLogin) goLogin();
    if (event === 'SIGNED_IN' && isLogin && session?.user?.email?.toLowerCase() === OWNER_EMAIL) {
      const next = safeNext(new URLSearchParams(location.search).get('next'));
      location.replace(next);
    }
  });
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-gf-signout]');
    if (!button) return;
    button.disabled = true;
    button.textContent = 'Signing out…';
    const { error } = await db.auth.signOut();
    if (error) { button.disabled = false; button.textContent = 'Sign out'; alert(error.message); }
    else location.replace(LOGIN);
  });
})();
