var CACHE="jcalc-v2";
var FILES=["./","index.html","manifest.json","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}));self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE;}).map(function(x){return caches.delete(x);}));}));self.clients.claim();});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var isPage=e.request.mode==="navigate"||/\.html$|\/$/.test(new URL(e.request.url).pathname);
  if(isPage){
    // pages: try the network first so updates show up right away, fall back to the saved copy offline
    e.respondWith(fetch(e.request).then(function(res){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy);});return res;})
      .catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||caches.match("index.html");});}));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){
    return r||fetch(e.request).then(function(res){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy);});return res;});
  }));
});
