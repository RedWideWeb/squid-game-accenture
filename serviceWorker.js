/* A super‑simple “cache‑first” SW */
const CACHE_NAME = 'sg-accenture-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/squid_game_logo.png',
  '/sounds/Doll Green Light.mp3',
  '/sounds/Doll Red Light.mp3',
  '/sounds/Round and Round.mp3',
  '/sounds/Pink Soldiers.mp3'
];

/* Install: grab everything now */
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();  // activate immediately
});

/* Clean up old caches if you bump CACHE_NAME */
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k!==CACHE_NAME)
        .map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch: respond from cache, fallback to network */
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
