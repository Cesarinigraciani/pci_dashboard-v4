// Desactivar completamente la caché y forzar siempre la versión nueva

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

// Todas las peticiones van directamente a la red
self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});

