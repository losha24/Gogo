const CACHE_NAME = 'okar-v4.4.0'; // עדכון גרסה לסינכרון עם ה-HTML
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './logo.png'
];

// התקנה ראשונית ושמירת נכסים במטמון
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('O-KAR: שומר קבצים חדשים במטמון');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // הפעלה מיידית של ה-Service Worker החדש
});

// ניקוי אוטומטי של מטמון ישן (חשוב מאוד למעבר גרסאות)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('O-KAR: מוחק גרסה ישנה מהמכשיר:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // מבטיח שה-SW שולט בכל הדפים באופן מיידי
  return self.clients.claim();
});

// אסטרטגיית טעינה: נסה מהמטמון, אם אין - הבא מהרשת
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
