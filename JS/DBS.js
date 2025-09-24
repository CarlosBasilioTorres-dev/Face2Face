const db = new PouchDB("codigo_postal")

db.info().then(async (info) => {
    if (info.doc_count === 0) {
        const loadingEl = document.querySelector(".loading h2");
        loadingEl.textContent = "Preparando la base de datos... descargando catálogos iniciales";

        const loadingBox = document.querySelector(".loading");
        loadingBox.style.top = "0px";
        loadingBox.style.opacity = "1";

        setTimeout(async () => {
            // Decodificación previa como ya vimos
            const res = await fetch('Catalogs/CP.txt');
            const buffer = await res.arrayBuffer();
            const decoder = new TextDecoder("iso-8859-1");
            const data = decoder.decode(buffer);

            const lineas = data.split("\n").map(l => l.trim()).filter(Boolean);
            const headers = lineas[0].split("|");
            const registros = lineas.slice(1).map(linea => {
                const valores = linea.split("|");
                let obj = {};
                headers.forEach((h, i) => {
                    obj[h] = valores[i] || "";
                });
                return obj;
            });

            const progress = (100 / registros.length);
            var width = 0;
            var cp = 0
            var cp_obj = {}

            for (const registro of registros) {
                width = width + progress
                document.querySelector(".loading h3").textContent = width.toFixed(2) + "%";


                if (cp !== registro.d_codigo && cp !== "0"){

                   await db.put(cp_obj).then(resp=>{
                        console.log("listo")
                    }).catch(err=>{
                        console.log(err)
                    })

                    cp_obj = {
                        _id : registro.d_codigo,
                        colonias : [
                            registro.d_asenta
                        ],
                        municipio : registro.D_mnpio,
                        estado: registro.d_estado,
                    }
                }else{
                    cp_obj.colonias.push(registro.d_asenta)
                }

                cp = registro.d_codigo
            }
        },2000)
    }
});
