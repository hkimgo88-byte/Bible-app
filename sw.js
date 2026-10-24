// 오프라인 사용: 앱 화면과 개역한글은 설치할 때 저장하고, 영어 번역본은 처음 열 때 저장
// 배포 워크플로가 c9ab014 를 커밋 ID로 바꿔, 새 버전을 올리면 설치된 앱도 자동으로 갱신됩니다.
const CACHE = "malsseum-c9ab014";
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
  // 앱 화면(HTML)은 인터넷이 되면 항상 최신본을 받고, 안 되면 저장본을 보여줌
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("index.html", copy)); }
          return res;
        })
        .catch(() => caches.match("index.html").then((hit) => hit || caches.match("./")))
    );
    return;
  }
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
