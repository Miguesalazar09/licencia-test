const CACHE_NAME = 'quiz-caba-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/quiz.js',
    '/js/analytics.js',
    '/manifest.json'
];

const API_CACHE_URLS = [
    // Aquí puedes agregar endpoints reales si los necesitas en el futuro
];
// Eliminado: API_CACHE_URLS

// Instalar Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache abierto');
                return cache.addAll(STATIC_CACHE_URLS);
            })
    );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
    // Strategy: Cache First para recursos estáticos
    if (STATIC_CACHE_URLS.includes(new URL(event.request.url).pathname)) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
        );
        return;
    }

    // Eliminado: Network First para APIs con fallback

    // Strategy: Network First para todo lo demás
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// Background sync para datos offline
self.addEventListener('sync', (event) => {
    if (event.tag === 'quiz-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    // Sincronizar datos de analytics guardados offline
    const analyticsData = await getStoredAnalytics();
    if (analyticsData.length > 0) {
        try {
            // Eliminado: fetch a /api/analytics
    // Eliminado: syncAnalytics relacionado a API

async function getStoredAnalytics() {
    // Implementar según tu sistema de storage
    return [];
}

async function clearStoredAnalytics() {
    // Implementar según tu sistema de storage
}
