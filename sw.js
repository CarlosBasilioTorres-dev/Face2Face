self.addEventListener("install", e => {
    console.log("Service Worker instalado");
});

self.addEventListener("fetch", e => {
    // Deja pasar todas las requests (sin cache por ahora)
});