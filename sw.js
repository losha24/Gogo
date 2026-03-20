const CACHE_NAME = 'okar-v5.3.2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './logo.png'
];

// התקנה ושמירת קבצים בזיכרון
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ניקוי גרסאות ישנות מהזיכרון של הטלפון
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// ניהול בקשות רשת
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
