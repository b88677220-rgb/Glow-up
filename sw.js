const CACHE='glowup-2026-v29';
const FILES=['./','./index.html','./manifest.json','./icon.svg','./exercise-library.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('glowup-2026-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));}return r}).catch(()=>caches.match('./index.html')));
 }else{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
 }
});
