const db = new PouchDB("codigo_postal");

async function cargarCP() {
    const info = await db.info();
    if (info.doc_count === 0) {
        const loadingEl = document.querySelector(".loading h2");
        loadingEl.textContent = "Preparando la base de datos... descargando catálogos iniciales";
        const loadingBox = document.querySelector(".loading");
        loadingBox.style.top = "0px";
        loadingBox.style.opacity = "1";

        // Espera 2 segundos
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Cargar archivo CP.txt
        const res = await fetch('Catalogs/CP.txt');
        const buffer = await res.arrayBuffer();
        const decoder = new TextDecoder("iso-8859-1");
        const data = decoder.decode(buffer);

        const lineas = data.split("\n").map(l => l.trim()).filter(Boolean);
        const headers = lineas[0].split("|");
        const registros = lineas.slice(1).map(linea => {
            const valores = linea.split("|");
            let obj = {};
            headers.forEach((h, i) => obj[h] = valores[i] || "");
            return obj;
        });

        const progress = (100 / registros.length);
        let cp_obj = {};
        let width = 0
        for (const registro of registros) {
            width += progress;
            document.querySelector(".loading h3").textContent = width.toFixed(2) + "%";

            if (cp !== registro.d_codigo && cp !== "0") {
                if (Object.keys(cp_obj).length) {
                    await db.put(cp_obj).catch(err => console.log(err));
                }
                cp_obj = {
                    _id: registro.d_codigo,
                    colonias: [registro.d_asenta],
                    municipio: registro.D_mnpio,
                    estado: registro.d_estado,
                };
            } else {
                cp_obj.colonias.push(registro.d_asenta);
            }

            cp = registro.d_codigo;
        }

        // Guardar el último registro
        if (Object.keys(cp_obj).length) {
            await db.put(cp_obj).catch(err => console.log(err));
        }

    }
}

// Función para inicializar bancos después de CP
async function cargarBancos() {
    await cargarCP();

    const bancos = new PouchDB("banco");
    const info = await bancos.info();

    if (info.doc_count === 0) {
        const loadingEl = document.querySelector(".loading h2");
        loadingEl.textContent = "Consultando al servidor listado de bines";
        document.querySelector(".loading h3").textContent = "0%";

        const loadingBox = document.querySelector(".loading");
        loadingBox.style.top = "0px";
        loadingBox.style.opacity = "1";


        const res = await fetch("https://savethechildrenmx.org/api/bines/all");
        const data = await res.json();

        const progress = 100 / data.length;
        let width = 0;

        for (const b of data) {
            await bancos.put({
                _id: b.id.toString(),
                banco: b.banco,
                producto: b.producto,
            }).then(()=>{
                console.log("listo")
            }).catch(err => console.log(err));
            width += progress;
            document.querySelector(".loading h3").textContent = width.toFixed(2) + "%";
        }

        loadingBox.style.top = "-100%";
        loadingBox.style.opacity = "0";
    }
}

cargarBancos();
