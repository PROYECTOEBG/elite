let handler = async () => {}

// Guardar el log original
const originalLog = console.log

// Redefinir console.log para interceptar mensajes
console.log = function (...args) {
  const texto = args.join(' ')

  // Detectar si se imprime el mensaje de sesión cerrada
  if (texto.includes('fue cerrada') && texto.includes('Intentando reconectar')) {
    enviarMensajeDeEspera()
  }

  // Imprimir el log normalmente
  originalLog.apply(console, args)
}

// Enviar mensaje al chat deseado
async function enviarMensajeDeEspera() {
  try {
    const idChat = 'tu-chat-id-aqui' // Ej: '5219999999999@s.whatsapp.net' o grupo
    if (global.conn && global.conn.sendMessage) {
      await global.conn.sendMessage(idChat, {
        text: 'Espera 30 segundos...'
      })
    }
  } catch (e) {
    console.error('Error enviando mensaje de espera:', e)
  }
}

export default handler
