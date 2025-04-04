// Definimos el subbot de motivación
const subbots = {};

function registrarSubbot(nombre, funcion) {
    subbots[nombre] = {
        activo: true,
        ejecutar: funcion
    };
    console.log(`Subbot '${nombre}' registrado y activo.`);
}

function cambiarEstadoSubbot(nombre, estado) {
    if (subbots[nombre]) {
        subbots[nombre].activo = estado;
        console.log(`Subbot '${nombre}' ahora está ${estado ? "activo" : "inactivo"}.`);
    } else {
        console.log(`Subbot '${nombre}' no encontrado.`);
    }
}

function ejecutarSubbot(nombre) {
    const subbot = subbots[nombre];
    if (subbot && subbot.activo) {
        return subbot.ejecutar();
    } else {
        return `El subbot '${nombre}' está inactivo o no existe.`;
    }
}

// Registrar subbot de motivación
registrarSubbot("motivacion", () => {
    const frases = [
        "¡Sigue adelante, lo estás haciendo genial!",
        "Cada día es una nueva oportunidad.",
        "No te rindas, el esfuerzo vale la pena.",
        "Eres más fuerte de lo que crees."
    ];
    return frases[Math.floor(Math.random() * frases.length)];
});

// Enviar motivación cada 10 segundos
setInterval(() => {
    if (subbots["motivacion"]?.activo) {
        console.log("Subbot motivación dice: " + ejecutarSubbot("motivacion"));
    }
}, 10000); // Cada 10 segundos

// Puedes cambiar el estado del subbot en cualquier momento
// Por ejemplo, para desactivarlo después de un tiempo (5 segundos):
setTimeout(() => {
    cambiarEstadoSubbot("motivacion", false);  // Desactiva el subbot
}, 50000); // 50 segundos (el subbot se desactivará después de 50 segundos)
