// ============================================================
// SERVICE WORKER MODERNO PARA DASHBOARD PCI
// Sin caché agresiva, sin errores clone(), sin bloqueos
// ============================================================

// Instalar SW inmediatamente
self.addEventListener("install", event => {
  self.skipWaiting();
});

// Activar SW inmediatamente
self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

// ============================================================
// FETCH: SIEMPRE RED → SIN CACHE
// Esto evita:
// - errores "Response body is already used"
// - versiones viejas del index
// - scripts bloqueados
// - datos corruptos
// ============================================================
self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});

