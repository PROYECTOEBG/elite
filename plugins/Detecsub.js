const { exec } = require("child_process");
const fs = require("fs");

// Ruta donde están los subbots
const rutaSubbots = "/home/container/GataJadiBot";

// Objeto para rastrear el estado de los subbots
let subbots = {};

// Función para escanear y detectar subbots automáticamente
function detectarSubbots() {
    console.log("🔍 Escaneando la carpeta de subbots...");

    // Verifica si la carpeta existe antes de leerla
    if (!fs.existsSync(rutaSubbots)) {
        console.error("❌ Error: La carpeta de subbots no existe. Verifica la ruta.");
        return;
    }

    fs.readdir(rutaSubbots, (err, archivos) => {
        if (err) {
            console.error("❌ Error al leer la carpeta de subbots:", err);
            return;
        }

        if (archivos.length === 0) {
            console.log("⚠️ No se encontraron subbots en la carpeta.");
            return;
        }

        archivos.forEach(archivo => {
            // Solo agregar si no está registrado
            if (!subbots[archivo]) {
                subbots[archivo] = { activo: true, ruta: `${rutaSubbots}/${archivo}` };
                console.log(`✅ Subbot detectado: ${archivo}`);
            }
        });
    });
}

// Función para verificar si los subbots están activos
function verificarSubbots() {
    console.log("🔎 Verificando el estado de los subbots...");

    let hayInactivos = false;

    for (const nombre in subbots) {
        if (!subbots[nombre].activo) {
            console.log(`⚠️ ${nombre} está inactivo. Intentando reconectar...`);
            reconectarSubbot(nombre);
            hayInactivos = true;
        }
    }

    if (!hayInactivos) {
        console.log("✅ Todos los subbots están activos.");
    }
}

// Función para reconectar un subbot
function reconectarSubbot(nombre) {
    const ruta = subbots[nombre].ruta;
    console.log(`♻️ Reiniciando ${nombre} en ${ruta}...`);

    exec(`cd ${ruta} && pm2 restart bot.js`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error al reiniciar ${nombre}:`, error);
            return;
        }
        console.log(`✅ ${nombre} reiniciado exitosamente.`);
        subbots[nombre].activo = true; // Lo marcamos como activo
    });
}

// Ejecutar una vez al inicio
detectarSubbots();

// Escanear la carpeta cada 10 segundos para detectar nuevos subbots
setInterval(detectarSubbots, 10000);

// Verificar cada 5 segundos si algún subbot está inactivo
setInterval(verificarSubbots, 5000);
