/* ============================================
   Lignum — Service Worker
   Offline მუშაობა + Cache
   ============================================ */

const CACHE_NAME = 'lignum-v1';

// ფაილები რომლებიც offline-ში ხელმისაწვდომი იქნება
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/gallery.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// ინსტალაცია — ფაილების შენახვა Cache-ში
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// გააქტიურება — ძველი Cache-ის წაშლა
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// მოთხოვნების დამუშავება — Cache First სტრატეგია
self.addEventListener('fetch', event => {
  // მხოლოდ GET მოთხოვნები
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached; // Cache-დან პასუხი

      // ინტერნეტიდან ჩამოტვირთვა და Cache-ში შენახვა
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;

        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => {
        // Offline-ში index.html-ი დავაბრუნოთ
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
