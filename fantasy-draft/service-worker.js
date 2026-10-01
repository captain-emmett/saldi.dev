const CACHE = 'saldi-fantasy-draft-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './players-1.js', './players-2.js', './players-3.js', './players-4.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('saldi-fantasy-draft-') && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(event.request);
    if (hit) return hit;
    try {
      const response = await fetch(event.request);
      if (response.ok && new URL(event.request.url).origin === self.location.origin) await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') return cache.match('./index.html');
      throw error;
    }
  }));
});
