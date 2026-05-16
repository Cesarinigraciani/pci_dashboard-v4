// ============================================================
// SERVICE WORKER AVANZADO PARA DASHBOARD PCI
// Cache inteligente + actualización automática + offline seguro
// ============================================================

// Cambia este número cuando subas una nueva versión
const CACHE_VERSION = "pci-cache-v4";

// Archivos que queremos cachear (solo los esenciales)
const ASSETS = [
  "/",
  "/index.html",
  "/styles/style-v2.css",
  "/scripts/obras.js",
  "/scripts/tareas.js",
  "/scripts/usuarios.js",
  "/assets/logo.png"
];

// ============================================================
// INSTALACIÓN — PRE-CACHE CONTROLADO
// ============================================================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ============================================================
// ACTIVACIÓN — LIMPIAR CACHÉS ANTIGUAS
// ============================================================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      );
    })
  );
  clients.claim();
});

// ============================================================
// ESTRATEGIA DE FETCH AVANZADA
// 1) Primero intenta red
// 2) Si falla → usa caché
// 3) Si no existe → error limpio
// ============================================================
self.addEventListener("fetch", event => {
  const request = event.request;

  // Evitar cachear peticiones POST o dinámicas
  if (request.method !== "GET") {
    return event.respondWith(fetch(request));
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Clonar respuesta para cachear sin romper el stream
        const responseClone = response.clone();

        caches.open(CACHE_VERSION).then(cache => {
          cache.put(request, responseClone);
        });

        return response;
      })
      .catch(() => {
        // Si no hay red → intentar caché
        return caches.match(request).then(cached => {
          return cached || new Response("Offline y sin caché disponible", {
            status: 503,
            statusText: "Offline"
          });
        });
      })
  );
});
