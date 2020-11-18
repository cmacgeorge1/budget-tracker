const { response } = require("express");

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const iconSizes = ["192", "512"];
const iconFiles = iconSizes.map(
    (size => `/icons/icon-${size}x${size}.png`)
);

const staticFilesToPreCache = [
    "/",
    "db.js",
    "index.html",
    "index.js",
    "manifest.json",
    "styles.css"
].concat(iconFiles);


// Install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(casche => {
            console.log("Your files were pre-cached successfully!");
            return caches.addAll(staticFilesToPreCache);
        })
    );

    self.skipWaiting()
});


// Activate
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key!== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return casches.delete(key);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});


// Fetch

self.addEventListener("fetch", function(evt) {
    const {url} = evt.request;
    if (url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                .then(response => {
                    if  (response.status === 200) {
                        cache.put(evt.request, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            }).catch(err => console.log(err))
        );
    } else {
        evt.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                
            })
        )
    }
})