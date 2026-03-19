const CACHE_NAME = 'okar-v4.3.0'; // עדכון גרסה כאן בכל שינוי קוד
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './logo.png'
];

// התקנה ושמירת קבצים במטמון
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('O-KAR: קבצים נשמרים במטמון');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // גורם ל-SW החדש להיכנס לתוקף מיד
});

// ניקוי מטמון של גרסאות ישנות
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('O-KAR: מוחק מטמון ישן:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// אסטרטגיית "Cache First" - טעינה מהירה גם ללא אינטרנט
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
