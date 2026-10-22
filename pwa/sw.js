// 오프라인 사용: 앱 화면과 개역한글은 설치할 때 저장하고, 영어 번역본은 처음 열 때 저장
const CACHE = "malsseum-v1";
const CORE = ["./", "index.html", "bible.json", "manifest.webmanifest", "icons/icon-192.png", "icons/favicon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        // 같은 사이트 파일과 Google Fonts는 저장해 두고 다음부터 오프라인에서도 사용
        const url = new URL(e.request.url);
        if (res.ok && (url.origin === location.origin || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com"))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
