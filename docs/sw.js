// KAT offline support: keeps a copy of the app on the phone so it opens without signal
const CACHE = 'kat-202611181810'; const FILES = ["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","lib/preact.umd.js","lib/hooks.umd.js","lib/htm.umd.js","lib/xlsx.full.min.js","lib/jspdf.umd.min.js","lib/jspdf.plugin.autotable.min.js","lib/pdf.min.js","lib/pdf.worker.min.js"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) { e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return res; }).catch(() => r))); return; }
  // own files: use the network when there is signal (so updates arrive), fall back to the saved copy offline
  e.respondWith(fetch(e.request).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return res; }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
