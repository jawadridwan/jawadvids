const CACHE_NAME = 'tube-metrics-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/placeholder.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                if (event.request.url.includes('/api/') || 
                    event.request.url.includes('/storage/') ||
                    event.request.url.includes('/rest/')) {
                  return;
                }
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Add support for downloading videos
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'DOWNLOAD_VIDEO') {
    const { videoUrl, fileName } = event.data;
    
    fetch(videoUrl)
      .then(response => response.blob())
      .then(blob => {
        const objectUrl = URL.createObjectURL(blob);
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'VIDEO_DOWNLOADED',
              url: objectUrl,
              fileName: fileName
            });
          });
        });
      })
      .catch(error => {
        console.error('Download failed:', error);
      });
  }
});