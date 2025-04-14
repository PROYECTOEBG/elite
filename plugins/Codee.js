let handler = async (m, { conn }) => {
  // Obtener el número del subbot (usuario) actual
  let user = conn.user || { id: '0000000000@s.whatsapp.net' }
  let numero = user.id.split('@')[0]

  // Mostrar mensaje en consola
  console.log(`La sesión (+${numero}) fue cerrada. Intentando reconectar...`)

  // Enviar mensaje al chat
  await conn.sendMessage(m.chat, { text: 'Espera 30 segundos...' })
}
handler.command = /^code$/i
handler.owner = true // solo owner, puedes cambiarlo si gustas
export default handler
