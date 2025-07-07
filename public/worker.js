console.log('Service worker file loaded.')

const CACHE_NAME = 'gasapp-v1';
const urlsToCache = [
  '/',
  '/offline'
];

/**
 * * FETCH event
 * ? It is triggered when the browser is requesting a resource
 * TODO: Add the logic to handle the request (investigate best practices and options)
 */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((response) => {
            // Cache successful responses for static assets
            if (response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
          });
      })
  );
});

/**
 * * INSTALL event
 * * It is triggered when the service worker has been installed
 * ? It is the best place to cache the app
 * TODO: Add the resources to cache
 */
self.addEventListener("install", (event) => {
  console.log('Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache individual resources instead of using addAll
        return Promise.all([
          cache.add('/'),
          cache.add('/offline').catch(() => console.log('Offline page not available'))
        ]);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});