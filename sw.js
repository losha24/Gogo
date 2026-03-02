self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('go-go-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/soccer_icon_192.png',
        '/soccer_icon_512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});