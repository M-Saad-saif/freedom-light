let CACHE_NAME = "freedom-lights-cache-v1";
let urlsToCache = [
  "./",
  "./index.html",
  "./fireworkblast.mp3",
  "./freedom.css",
  "./freedom icon.ico",
  "./freedom.js",
  "./launchsound.flac",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
