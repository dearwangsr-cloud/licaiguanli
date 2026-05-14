const CACHE_NAME = 'finance-note-v1';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
];

// 安装
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 激活
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// 请求策略
self.addEventListener('fetch', event => {

  // HTML 永远走网络优先
  if (event.request.mode === 'navigate') {

    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );

    return;
  }

  // 其他资源缓存优先
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});