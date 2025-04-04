function detectarEmocion(texto) {
    const emociones = {
        feliz: ['feliz', 'alegre', 'contento', 'genial', 'emocionado'],
        triste: ['triste', 'deprimido', 'melancólico', 'llorando'],
        enojado: ['enojado', 'molesto', 'furioso', 'irritado'],
        sorprendido: ['sorprendido', 'impresionado', 'impactado'],
        neutral: ['ok', 'normal', 'meh', 'bien']
    };

    const textoLimpio = texto.toLowerCase();
    
    for (let emocion in emociones) {
        for (let palabra of emociones[emocion]) {
            if (textoLimpio.includes(palabra)) {
                return `Detecté que estás ${emocion}.`;
            }
        }
    }

    return 'No estoy seguro de cómo te sientes. ¿Podrías contarme más?';
}

// Ejemplo de uso:
console.log(detectarEmocion("Hoy me siento muy feliz y emocionado"));
console.log(detectarEmocion("Estoy un poco triste por lo que pasó"));
console.log(detectarEmocion("Meh, solo otro día normal"));
