/*
 * TODO: import `workbox` directly when ES Module for service workers is supported by mainstream browsers.
 * See: https://bugs.chromium.org/p/chromium/issues/detail?id=824647
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const { recipes: { imageCache, pageCache, staticResourceCache } } = workbox;

imageCache();
pageCache();
staticResourceCache();
