const V = 'pustaka-v6';
const CORE = ['./', 'index.html', 'firebase-config.js', 'manifest.json', 'icon-192.png', 'icon-512.png', 'maskable-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(V)
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  // Jangan campur tangan pada lalu lintas Firebase (data dan login).
  const skip = /(firestore|identitytoolkit|securetoken|firebaseio)\./.test(u.hostname) ||
    (/googleapis\.com$/.test(u.hostname) && !/^fonts\./.test(u.hostname));
  if (skip) return;

  if (u.origin === location.origin) {
    // Jaringan dulu, cadangan dari cache bila offline.
    e.respondWith(
      fetch(r).then(res => {
        if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
        return res;
      }).catch(() => caches.match(r).then(m => m || caches.match('index.html')))
    );
  } else if (/(cdnjs\.cloudflare\.com|unpkg\.com|gstatic\.com|fonts\.googleapis\.com)$/.test(u.hostname)) {
    // Pustaka luar: pakai cache, perbarui di belakang layar.
    e.respondWith(
      caches.match(r).then(m => {
        const net = fetch(r).then(res => {
          if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
          return res;
        }).catch(() => m);
        return m || net;
      })
    );
  }
});
