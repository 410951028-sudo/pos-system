const CACHE_NAME = "pos-cache-v1.1";

const urlsToCache = [
  "./",
  "./index.html",
  "./app.js",
  "./css/style.css"
];

self.addEventListener("install", (e) => {

  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener("activate", (e) => {

  self.clients.claim();

  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
