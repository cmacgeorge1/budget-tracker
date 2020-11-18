
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



// Fetch