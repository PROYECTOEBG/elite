const subbots = {
    motivacion: { activo: true },
    chistes: { activo: true },
};

// Función para registrar un subbot
function registrarSubbot(nombre) {
    subbots[nombre] = {
        activo: true, // El subbot se activa al registrarse
    };
    console.log(`Subbot '${nombre}' registrado y activo.`);
}

// Función para cambiar el estado (activo/inactivo) de un subbot
function cambiarEstadoSubbot(nombre, estado) {
    if (subbots[nombre]) {
        subbots[nombre].activo = estado;
        console.log(`Subbot '${nombre}' ahora está ${estado ? "activo" : "inactivo"}.`);
    } else {
        console.log(`Subbot '${nombre}' no encontrado.`);
    }
}

// Función para ejecutar un subbot
function ejecutarSubbot(nombre) {
    const subbot = subbots[nombre];
    if (subbot && subbot.activo) {
        console.log(`Ejecutando subbot '${nombre}'...`);
        return `${nombre} está activo.`;
    } else {
        return `El subbot '${nombre}' está inactivo.`;
    }
}

// Crear subbots
registrarSubbot("motivacion");
registrarSubbot("chistes");

// Función para detectar si los subbots están activos
function verificarSubbots() {
    let todoActivo = true;
    
    // Verificamos el estado de cada subbot
    for (const nombre in subbots) {
        const subbot = subbots[nombre];
        if (!subbot.activo) {
            console.log(`Subbot '${nombre}' está inactivo. Reiniciando...`);
            todoActivo = false;
            break;
        }
    }
    
    // Si algún subbot está inactivo, reiniciar el bot
    if (!todoActivo) {
        reiniciarBot();
    } else {
        console.log("Todos los subbots están activos.");
    }
}

// Función para reiniciar el bot (se reinician los subbots)
function reiniciarBot() {
    console.log("Reiniciando el bot...");

    // Reactivar todos los subbots
    for (const nombre in subbots) {
        subbots[nombre].activo = true;
        console.log(`Subbot '${nombre}' reactivado.`);
    }

    // Puedes agregar aquí un código para reiniciar el bot completamente si es necesario
    // En este caso, solo estamos reactivando los subbots.
}

// Verificar el estado de los subbots cada 10 segundos
setInterval(verificarSubbots, 10000); // Ejecuta cada 10 segundos

// Simular que un subbot se vuelve inactivo
setTimeout(() => {
    cambiarEstadoSubbot("motivacion", false); // Desactivamos el subbot de motivación para probar
}, 25000); // Después de 25 segundos

// Simulamos que el bot sigue funcionando
setInterval(() => {
    console.log(ejecutarSubbot("motivacion"));
    console.log(ejecutarSubbot("chistes"));
}, 5000);
