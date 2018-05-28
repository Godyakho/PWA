// 注册服务工作线程
var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

// 首次访问页面时将会触发安装事件,此事件处理程序内，我们将缓存应用所需的全部
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  // waitUntil() 扩展了事件的生命周期。在服务工作线程中，延长事件的寿命从而阻止浏览器在事件中的异步操作完成之前终止服务工作线程。
  e.waitUntil(
    // caches.open() 打开缓存并提供一个缓存名称
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      // cache.addAll() 网址列表参数的方法随即从服务器获取文件，并将响应添加到缓存内
      return cache.addAll(filesToCache);
    })
  );
});

// activate 事件会在服务工作线程启动时触发
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    // 清理旧版本
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // 更新客户端
  return self.clients.claim();
});


// 从缓存提供 App Shell
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    // caches.match() 会由内而外对触发抓取事件的网络请求进行评估，并检查以确认它是否位于缓存内。
    // 它随即使用已缓存版本作出响应，或者利用 fetch 从网络获取一个副本。response 通过 e.respondWith() 传回至网页。
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});