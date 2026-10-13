// J플래너 서비스 워커: 앱 화면은 오프라인에서도 열리게, 새 버전은 온라인일 때 바로 반영되게.
const CACHE = "jplanner-v3";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-maskable.png"];
const LIBS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);

  // 앱 화면: 네트워크 우선(새 버전 반영), 실패하면 캐시
  if(req.mode === "navigate" || (url.origin === location.origin)){
    e.respondWith(
      fetch(req).then(res => {
        if(res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match("index.html")))
    );
    return;
  }

  // 지도 라이브러리(Leaflet): 캐시 우선
  if(req.url.startsWith(LIBS)){
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    })));
  }
  // 지도 타일·경로·좌표 검색은 그대로 네트워크로
});
