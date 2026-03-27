self.addEventListener('install', (e) => {
  console.log('SW install');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('SW active');
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Pass-through fetch just to satisfy PWA specifications.
  return;
});
