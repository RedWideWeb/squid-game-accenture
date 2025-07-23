/* A super‑simple “cache‑first” SW */
const CACHE_NAME = 'sg-accenture-v1';
const ASSETS = [
  './',
  './index.html',
  './squid_game_logo.png',
  './sounds/doll_green_light.mp3',
  './sounds/doll_red_light.mp3',
  './sounds/round_and_round.mp3',
  './sounds/pink_soldiers.mp3'
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
  if (evt.request.method !== 'GET' ||
    new URL(evt.request.url).origin !== location.origin) return;

  evt.respondWith(
    caches.match(evt.request, {ignoreSearch: true}).then(hit => {
      if (hit) return hit;                 // ① served from cache
      return fetch(evt.request).then(res => { // ② else go network‑first
        // stash a copy for next time
        return caches.open(CACHE_NAME).then(c => {
          c.put(evt.request, res.clone());
          return res;
        });
      });
    })
  );
});
