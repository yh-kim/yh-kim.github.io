'use strict';

var CACHE_PREFIX = 'html-viewer-';
var CACHE_NAME = CACHE_PREFIX + 'v12';
var APP_ROOT = new URL('./', self.location.href);
var APP_SHELL = new URL('index.html', APP_ROOT).href;
var APP_FILES = [
  APP_ROOT.href,
  APP_SHELL,
  new URL('app.css', APP_ROOT).href,
  new URL('app.js', APP_ROOT).href,
  new URL('manifest.json', APP_ROOT).href,
  new URL('../../../pwa/icons/400.jpg', APP_ROOT).href,
  new URL('../../../pwa/icons/512.png', APP_ROOT).href
];
var APP_FILE_URLS = new Set(APP_FILES);

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(APP_FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (names) {
        return Promise.all(names.filter(function (name) {
          return name.indexOf(CACHE_PREFIX) === 0 && name !== CACHE_NAME;
        }).map(function (name) { return caches.delete(name); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);
  var canonicalUrl = new URL(request.url);
  canonicalUrl.search = '';
  canonicalUrl.hash = '';

  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.indexOf(APP_ROOT.pathname) !== 0) return;

  if (request.mode === 'navigate' && request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          if (response.ok) {
            var copy = response.clone();
            var cacheKey = canonicalUrl.href === APP_SHELL ? APP_SHELL : APP_ROOT.href;
            caches.open(CACHE_NAME).then(function (cache) { cache.put(cacheKey, copy); });
          }
          return response;
        })
        .catch(function () {
          return caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(APP_ROOT.href).then(function (cached) {
              return cached || cache.match(APP_SHELL);
            });
          });
        })
    );
    return;
  }

  if (!APP_FILE_URLS.has(canonicalUrl.href)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(canonicalUrl.href).then(function (cached) {
        var network = fetch(request).then(function (response) {
          if (response.ok) cache.put(canonicalUrl.href, response.clone());
          return response;
        }).catch(function () { return cached; });
        return cached || network;
      });
    })
  );
});
