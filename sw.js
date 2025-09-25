importScripts("JS/sw-utils.js")
/*declarar nombres de caches*/

const STATIC_CACHE = "static-v1";
const  DYNAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_STATIC_SHELL = [
    "/",
    "index.html",
    "style.css",
    "JS/app.js",
    "JS/DBS.js",
    "JS/sw-utils.js",
    "JS/Validations.js",
    "st.jpg"
]

const APP_INMUTABLE_SHELL = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Oswald:wght@200..700&display=swap",
    "https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js"
];


self.addEventListener("install", e => {
    const staticCache = caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(APP_STATIC_SHELL);
    });

    const inmutableCache = caches.open(INMUTABLE_CACHE).then(cache => {
        return cache.addAll(APP_INMUTABLE_SHELL);
    });
});

self.addEventListener("fetch", event => {
    const respuesta = caches.match(event.request).then(resp => {
        if(resp){
            return resp;
        }else{
            return fetch(event.request).then(nElement =>{
                return actualizaCacheDinamico(DYNAMIC_CACHE,event.request,nElement);
            });
        }
    });

    event.respondWith(respuesta);
});