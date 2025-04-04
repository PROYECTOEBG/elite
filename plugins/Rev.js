let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo
  
  let subject = groupMetadata.subject || "el grupo"
  let botName = conn.user.name // Obtiene el nombre de la cuenta del bot
  
  let welcomeBot = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢!🥇  
¡Soy ${botName}, su nuevo asistente digital!  
━━━━━━━━━━━━━━━━━━━  
⚡ *Mis funciones :*  
▸  Descargar música/videos  
▸  Búsquedas en Google  
▸  Juegos y diversión grupal  
▸  Generar imágenes con IA  
▸  Herramientas para Free Fire  
━━━━━━━━━━━━━━━━━━━  
📂 *Mis menus:*  
▸  .menu → *Menú general*  
▸  .menuimg → *Imágenes AI*  
▸  .menuhot → *Contenido hot*  
▸  .menuaudios→ *Audios y efectos*  
▸  .menujuegos → *Juegos grupales*  
▸  .menufreefire → *Free Fire tools*  
━━━━━━━━━━━━━━━━━━━  
©EliteBotGlobal 2023`

  await this.sendMessage(m.chat, { text: welcomeBot }, { quoted: m })
}

export default handler
