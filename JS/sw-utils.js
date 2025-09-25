const actualizaCacheDinamico = (cache, req, res) =>{
    if (res.ok){
        return caches.open(cache).then(cache =>{
            cache.put(req, res.clone());
            return res.clone();
        });
    }else{
        return res;
    }
};