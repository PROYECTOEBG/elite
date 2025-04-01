
/*
  export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
if (m.chat === '120363322713003916@newsletter') return !0
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`> 𝗔𝗗𝗩𝗘𝗥𝗧𝗘𝗡𝗖𝗜𝗔 

𝘏𝘰𝘭𝘢 𝘏𝘶𝘮𝘢𝘯𝘰 , 𝘦𝘴𝘵𝘢 𝘱𝘳𝘰𝘩𝘪𝘣𝘪𝘥𝘰 𝘦𝘴𝘤𝘳𝘪𝘣𝘪𝘳𝘮𝘦 𝘢 𝘮𝘪 𝘱𝘳𝘪𝘷𝘢𝘥𝘰.

> 𝘜́𝘯𝘦𝘵𝘦 𝘢 𝘯𝘶𝘦𝘴𝘵𝘳𝘢 𝘤𝘰𝘮𝘶𝘯𝘪𝘥𝘢𝘥 𝘌𝘭𝘪𝘵𝘦𝘉𝘰𝘵𝘎𝘭𝘰𝘣𝘢𝘭 𝘺 𝘤𝘰𝘯𝘵𝘢́𝘤𝘵𝘢𝘵𝘦 𝘤𝘰𝘯 𝘦𝘭 𝘤𝘳𝘦𝘢𝘥𝘰𝘳 𝘱𝘢𝘳𝘢 𝘢𝘥𝘲𝘶𝘪𝘳𝘪𝘳 𝘶𝘯 𝘣𝘰𝘵 𝘱𝘳𝘰𝘱𝘪𝘰 𝘱𝘦𝘳𝘴𝘰𝘯𝘢𝘭𝘪𝘻𝘢𝘥𝘰 𝘰 𝘌𝘭𝘪𝘵𝘦𝘉𝘰𝘵𝘎𝘭𝘰𝘣𝘢𝘭.
https://whatsapp.com/channel/0029Vatsbep84OmF6dDXpm1s

⚠️ *Serás Bloqueado(a)* ⚠️`, false, {mentions: [m.sender]});
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
*/

/*----------------------[ AUTOREAD ]-----------------------*/
let handler = m => m
handler.all = async function (m) {
let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

let setting = global.db.data.settings[this.user.jid]
const settingsREAD = global.db.data.settings[this.user.jid] || {}

if (m.text && prefixRegex.test(m.text)) {
await this.sendPresenceUpdate('composing', m.chat)
await this.readMessages([m.key]) 
        
let usedPrefix = m.text.match(prefixRegex)[0]
let command = m.text.slice(usedPrefix.length).trim().split(' ')[0]
}} 

export default handler  

/*----------------------[ ANTIPRIVADO ]-----------------------*/
const comandos = /piedra|papel|tijera|estado|verificar|code|jadibot --code|--code|creadora|bottemporal|grupos|instalarbot|términos|bots|deletebot|eliminarsesion|serbot|verify|register|registrar|reg|reg1|nombre|name|nombre2|name2|edad|age|edad2|age2|genero|género|gender|identidad|pasatiempo|hobby|identify|finalizar|pas2|pas3|pas4|pas5|registroc|deletesesion|registror|jadibot/i

//let handler = m => m
handler.before = async function (m, { conn, isOwner, isROwner }) {
if (m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
const regexWithPrefix = new RegExp(`^${prefix.source}\\s?${comandos.source}`, 'i')
if (regexWithPrefix.test(m.text.toLowerCase().trim())) return !0

let chat, user, bot, mensaje
chat = global.db.data.chats[m.chat]
user = global.db.data.users[m.sender]
bot = global.db.data.settings[this.user.jid] || {}

if (bot.antiPrivate && !isOwner && !isROwner) {
return await conn.reply(m.chat, mid.mAdvertencia + mid.smsprivado(m, cuentas), m, { mentions: [m.sender] })  
await this.updateBlockStatus(m.sender, 'block')
}
return !1
}
//export default handler
