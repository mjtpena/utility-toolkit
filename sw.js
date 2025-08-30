/**
 * Service Worker for Utility Toolkit
 * Enables offline functionality and caching for all tools
 */

const CACHE_NAME = 'utility-toolkit-v1.0.0';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    
    // Core Framework Scripts
    '/shared/utils/storage.js',
    '/shared/utils/calculations.js',
    '/shared/utils/formatters.js',
    '/shared/utils/validators.js',
    '/shared/components/ui.js',
    '/shared/components/forms.js',
    '/shared/components/results.js',
    '/shared/components/tool-templates.js',
    '/shared/components/tool-registry.js',
    '/shared/components/router.js',
    '/shared/components/page-generator.js',
    '/shared/components/route-init.js',
    
    // Tool Libraries
    '/tools/calculators/financial-tools.js',
    '/tools/calculators/financial-tools-2.js',
    '/tools/calculators/health-fitness-tools.js',
    '/tools/calculators/math-science-tools.js',
    '/tools/calculators/advanced-calculators.js',
    '/tools/converters/unit-converters.js',
    '/tools/converters/data-format-tools.js',
    '/tools/utilities/text-tools.js',
    '/tools/utilities/text-tools-2.js',
    '/tools/utilities/dev-tools.js',
    '/tools/generators/security-tools.js',
    '/tools/design/color-design-tools.js',
    '/tools/design/design-tools-2.js',
    '/tools/visualization/chart-tools.js',
    '/tools/visualization/chart-tools-2.js',
    '/tools/media/image-tools.js',
    '/tools/media/image-tools-2.js',
    '/tools/media/image-tools-3.js',
    '/tools/business/seo-tools.js',
    '/tools/business/productivity-tools.js',
    '/tools/business/pdf-tools.js',
    '/tools/business/api-tools.js',
    '/tools/business/file-tools.js',
    
    // External Libraries (CDN)
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Install Event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Install Event');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Files Cached Successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.log('Service Worker: Cache Failed', error);
            })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activate Event');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated');
            return self.clients.claim();
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Handle routing for SPA
    if (event.request.mode === 'navigate') {
        event.respondWith(
            caches.match('/index.html')
                .then((response) => {
                    return response || fetch('/index.html');
                })
                .catch(() => {
                    return caches.match('/index.html');
                })
        );
        return;
    }
    
    // Handle other requests
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version
                if (response) {
                    return response;
                }
                
                // Fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Cache the fetched resource
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // If network fails, try to return cached version
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // For tool pages, redirect to main app
                        if (event.request.url.includes('/tools/')) {
                            return caches.match('/index.html');
                        }
                        
                        return new Response('Offline - Content not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background Sync (for future use)
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background Sync');
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync tasks
            console.log('Background sync completed')
        );
    }
});

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push Received');
    
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification Click');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Message Event (communication with main thread)
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message Received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

console.log('Service Worker: Loaded');