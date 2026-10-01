// Retire the old fantasy app's root worker so it cannot serve its cached homepage
// in place of the portfolio. Do not clear localStorage, saved drafts, or caches.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    await self.registration.unregister();
    const windows = await self.clients.matchAll({ type: 'window' });
    await Promise.all(windows.map(client => {
      const url = new URL(client.url);
      if (url.pathname === '/' || url.pathname === '/index.html') return client.navigate(client.url);
    }));
  })());
});
