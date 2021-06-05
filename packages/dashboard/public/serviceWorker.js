/*
 * TODO: import `workbox` directly when ES Module for service workers is supported by mainstream browsers.
 * Chrome: available in v91 (https://bugs.chromium.org/p/chromium/issues/detail?id=824647)
 * Firefox: pending (https://bugzilla.mozilla.org/show_bug.cgi?id=1360870)
 * Safari: available in TP122 (https://webkit.org/blog/11577/release-notes-for-safari-technology-preview-122/)
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const {
    recipes: { imageCache, pageCache, staticResourceCache },
} = workbox;

imageCache();
pageCache();
staticResourceCache();
