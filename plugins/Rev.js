/*let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo
  
  let subject = groupMetadata.subject || "el grupo"
  let welcomeBot = `🥇 ¡𝗛𝗢𝗟𝗔 𝗚𝗥𝗨𝗣𝗢!🥇
¡Soy ${botName}, su nuevo asistente digital!
━━━━━━━━━━━━━━━━━━━  
⚡ *Mis funciones :*  
▸  Descargar música/videos 
▸  Búsquedas en Google/Wikipedia 
▸  Juegos y diversión grupal 
▸  Generar imágenes con IA 
▸  Herramientas para Free Fire 
━━━━━━━━━━━━━━━━━━━  
📂 *Mis menus:*  
▸  .menu → *Menú general*  
▸  .menuimg → *Imágenes AI*  
▸  .menuhot → *Contenido destacado*  
▸  .menuaudios→ *Audios y efectos* 
▸  .menujuegos → *Juegos grupales* 
▸  .menufreefire → *Free Fire tools*
━━━━━━━━━━━━━━━━━━━  
©EliteBotGlobal 2023`

  await this.sendMessage(m.chat, { text: welcomeBot }, { quoted: m })
}

export default handler
*/

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo
  
  let subject = groupMetadata.subject || "el grupo"
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Si necesitan ayuda, escriban *#menu* para ver mis comandos.`

  await this.sendMessage(m.chat, { text: welcomeBot }, { quoted: m })
}

export default handler

  
