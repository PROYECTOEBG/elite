let handler = async (m, { conn }) => {
  try {
    await conn.presenceSubscribe(m.sender)
    m.reply('Tu bot **sí tiene acceso** a presenceSubscribe.')
  } catch (e) {
    console.error(e)
    m.reply('Tu bot **NO tiene acceso** a presenceSubscribe.')
  }
}
handler.command = /^prueba2$/i
export default handler
