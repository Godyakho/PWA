// 注册服务工作线程
var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [];

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
  });