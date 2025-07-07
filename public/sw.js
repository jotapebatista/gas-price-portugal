const CACHE_NAME = 'gasapp-v2';
const STATIC_CACHE = 'gasapp-static-v2';
const API_CACHE = 'gasapp-api-v2';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetDistritos',
  'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetTiposCombustiveis',
  /^https:\/\/precoscombustiveis\.dgeg\.gov\.pt\/api\/PrecoComb\/GetMunicipios/,
  /^https:\/\/precoscombustiveis\.dgeg\.gov\.pt\/api\/PrecoComb\/PesquisarPostos/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (isAPIRequest(url)) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static file requests
  if (isStaticRequest(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // For other requests, try network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.status === 200 && isCacheableRequest(request)) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline');
        }
        return new Response('Network error', { status: 503 });
      })
  );
});

// Check if request is for API
function isAPIRequest(url) {
  return API_ENDPOINTS.some(endpoint => {
    if (typeof endpoint === 'string') {
      return url.href === endpoint;
    }
    if (endpoint instanceof RegExp) {
      return endpoint.test(url.href);
    }
    return false;
  });
}

// Check if request is for static files
function isStaticRequest(url) {
  return STATIC_FILES.includes(url.pathname) || 
         url.pathname.startsWith('/_nuxt/') ||
         url.pathname.startsWith('/assets/');
}

// Check if request should be cached
function isCacheableRequest(request) {
  return request.method === 'GET' && 
         (request.destination === 'document' || 
          request.destination === 'script' || 
          request.destination === 'style' ||
          request.destination === 'image');
}

// Handle API requests with cache-first strategy
async function handleAPIRequest(request) {
  try {
    // Try cache first
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Serving API from cache:', request.url);
      return cachedResponse;
    }

    // If not in cache, try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      console.log('Cached API response:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Try to return cached response as fallback
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Returning cached API response as fallback:', request.url);
      return cachedResponse;
    }
    
    // Return error response
    return new Response(JSON.stringify({ 
      error: 'Network error', 
      offline: true 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Serving static file from cache:', request.url);
      return cachedResponse;
    }

    // If not in cache, try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Static request failed:', error);
    
    // For navigation requests, return offline page
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    
    return new Response('Not found', { status: 404 });
  }
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(performBackgroundSync());
  }
});

// Perform background sync
async function performBackgroundSync() {
  try {
    // Update essential data in background
    const endpoints = [
      'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetDistritos',
      'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/GetTiposCombustiveis'
    ];
    
    const cache = await caches.open(API_CACHE);
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const responseClone = response.clone();
          await cache.put(endpoint, responseClone);
          console.log('Background sync updated:', endpoint);
        }
      } catch (error) {
        console.error('Background sync failed for:', endpoint, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: 'Gas prices updated! Check for new prices in your area.',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Prices',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('GasApp Portugal', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 