import fs from 'fs'
import translate from '@vitalets/google-translate-api'
import moment from 'moment-timezone'
import ct from 'countries-and-timezones'
import { parsePhoneNumber } from 'libphonenumber-js'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
if (m.fromMe) return
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[conn.user.jid] || {}

const commandsConfig = [
{ comando: (bot.restrict ? 'off ' : 'on ') + 'restringir , restrict', descripcion: bot.restrict ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Permisos para el Bot', showPrefix: true },
{ comando: (bot.antiCall ? 'off ' : 'on ') + 'antillamar , anticall', descripcion: bot.antiCall ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Evitar recibir llamadas en el Bot', showPrefix: true },
{ comando: (bot.temporal ? 'off ' : 'on ') + 'temporal', descripcion: bot.temporal ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Ingreso del Bot temporalmente en grupos', showPrefix: true },
{ comando: (bot.jadibotmd ? 'off ' : 'on ') + 'serbot , jadibot', descripcion: bot.jadibotmd ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Permitir o no Sub Bots en este Bot', showPrefix: true },
{ comando: (bot.antiSpam ? 'off ' : 'on ') + 'antispam', descripcion: bot.antiSpam ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Dar advertencia por hacer Spam', showPrefix: true },
{ comando: (bot.antiSpam2 ? 'off ' : 'on ') + 'antispam2', descripcion: bot.antiSpam2 ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Omitir resultado de comandos consecutivos', showPrefix: true },
{ comando: (bot.antiPrivate ? 'off ' : 'on ') + 'antiprivado , antiprivate', descripcion: bot.antiPrivate ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Prohibe que este Bot sea usado en privado', showPrefix: true },
{ comando: (global.opts['self'] ? 'on ' : 'off ') + 'publico , public', descripcion: global.opts['self'] ? '❌' + 'Desactivado || Disabled' : '✅' + 'Activado || Activated', contexto: 'Permitir que todos usen el Bot', showPrefix: true },
{ comando: (global.opts['autoread'] ? 'off ' : 'on ') + 'autovisto , autoread', descripcion: global.opts['autoread'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Mensajes leídos automáticamente', showPrefix: true },
{ comando: (global.opts['gconly'] ? 'off ' : 'on ') + 'sologrupos , gconly', descripcion: global.opts['gconly'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Hacer que funcione sólo en grupos', showPrefix: true },
{ comando: (global.opts['pconly'] ? 'off ' : 'on ') + 'soloprivados , pconly', descripcion: global.opts['pconly'] ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled', contexto: 'Hacer que funcione sólo al privado', showPrefix: true },
 
{ comando: m.isGroup ? (chat.welcome ? 'off ' : 'on ') + 'bienvenida , welcome' : false, descripcion: m.isGroup ? (chat.welcome ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Establecer bienvenida en grupos', showPrefix: true },
{ comando: m.isGroup ? (chat.detect  ? 'off ' : 'on ') + 'avisos , detect' : false, descripcion: m.isGroup ? (chat.detect  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Avisos importantes en grupos', showPrefix: true },
{ comando: m.isGroup ? (chat.autolevelup  ? 'off ' : 'on ') + 'autonivel , autolevelup' : false, descripcion: m.isGroup ? (chat.autolevelup  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Subir de nivel automáticamente', showPrefix: true },
{ comando: m.isGroup ? (chat.modoadmin  ? 'off ' : 'on ') + 'modoadmin , modeadmin' : false, descripcion: m.isGroup ? (chat.modoadmin  ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Sólo admins podrán usar en grupo', showPrefix: true },

{ comando: m.isGroup ? (chat.stickers ? 'off ' : 'on ') + 'stickers' : false, descripcion: m.isGroup ? (chat.stickers ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Stickers automáticos en chats', showPrefix: true }, 
{ comando: m.isGroup ? (chat.autosticker ? 'off ' : 'on ') + 'autosticker' : false, descripcion: m.isGroup ? (chat.autosticker ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Multimedia a stickers automáticamente', showPrefix: true }, 
{ comando: m.isGroup ? (chat.reaction ? 'off ' : 'on ') + 'reacciones , reaction' : false, descripcion: m.isGroup ? (chat.reaction ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Reaccionar a mensajes automáticamente', showPrefix: true }, 
{ comando: m.isGroup ? (chat.audios ? 'off ' : 'on ') + 'audios' : false, descripcion: m.isGroup ? (chat.audios ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Audios automáticos en chats', showPrefix: true }, 
{ comando: m.isGroup ? (chat.modohorny ? 'off ' : 'on ') + 'modocaliente , modehorny' : false, descripcion: m.isGroup ? (chat.modohorny ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Comandos con contenido para adultos', showPrefix: true }, 
{ comando: m.isGroup ? (chat.antitoxic ? 'off ' : 'on ') + 'antitoxicos , antitoxic' : false, descripcion: m.isGroup ? (chat.antitoxic ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Sancionar/eliminar a usuarios tóxicos', showPrefix: true },
{ comando: m.isGroup ? (chat.antiver ? 'off ' : 'on ') + 'antiver , antiviewonce' : false, descripcion: m.isGroup ? (chat.antiver ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: ' No acultar mensajes de \"una sola vez\"', showPrefix: true }, 
{ comando: m.isGroup ? (chat.delete ? 'off ' : 'on ') + 'antieliminar , antidelete' : false, descripcion: m.isGroup ? (chat.delete ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Mostrar mensajes eliminados', showPrefix: true },
{ comando: m.isGroup ? (chat.antifake ? 'off ' : 'on ') + 'antifalsos , antifake' : false, descripcion: m.isGroup ? (chat.antifake ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar usuarios falsos/extranjeros', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTraba ? 'off ' : 'on ') + 'antitrabas , antilag' : false, descripcion: m.isGroup ? (chat.antiTraba ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Enviar mensaje automático en caso de lag', showPrefix: true },
{ comando: m.isGroup ? (chat.simi ? 'off ' : 'on ') + 'simi' : false, descripcion: m.isGroup ? (chat.simi ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'SimSimi responderá automáticamente', showPrefix: true },
{ comando: m.isGroup ? (chat.modoia ? 'off ' : 'on ') + 'ia' : false, descripcion: m.isGroup ? (chat.modoia ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Inteligencia artificial automática', showPrefix: true },

{ comando: m.isGroup ? (chat.antilink ? 'off ' : 'on ') + 'antienlace , antilink' : false, descripcion: m.isGroup ? (chat.antilink ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de WhatsApp', showPrefix: true },
{ comando: m.isGroup ? (chat.antilink2 ? 'off ' : 'on ') + 'antienlace2 , antilink2' : false, descripcion: m.isGroup ? (chat.antilink2 ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces que contenga \"https\"', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTiktok ? 'off ' : 'on ') + 'antitiktok , antitk' : false, descripcion: m.isGroup ? (chat.antiTiktok ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de TikTok', showPrefix: true },
{ comando: m.isGroup ? (chat.antiYoutube ? 'off ' : 'on ') + 'antiyoutube , antiyt' : false, descripcion: m.isGroup ? (chat.antiYoutube ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de YouTube', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTelegram ? 'off ' : 'on ') + 'antitelegram , antitg' : false, descripcion: m.isGroup ? (chat.antiTelegram ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Telegram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiFacebook ? 'off ' : 'on ') + 'antifacebook , antifb' : false, descripcion: m.isGroup ? (chat.antiFacebook ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Facebook', showPrefix: true },
{ comando: m.isGroup ? (chat.antiInstagram ? 'off ' : 'on ') + 'antinstagram , antig' : false, descripcion: m.isGroup ? (chat.antiInstagram ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de Instagram', showPrefix: true },
{ comando: m.isGroup ? (chat.antiTwitter ? 'off ' : 'on ') + 'antiX' : false, descripcion: m.isGroup ? (chat.antiTwitter ? '✅ ' + 'Activado || Activated' : '❌ ' + 'Desactivado || Disabled') : false, contexto: 'Eliminar enlaces de X (Twitter)', showPrefix: true },
]
 
try {
let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let d = new Date(new Date + 3600000)
let locale = 'es'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let { money, joincount } = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
let pp = gataVidMenu
let pareja = global.db.data.users[m.sender].pasangan 
const numberToEmoji = { "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣", }
let lvl = level
let emoji = Array.from(lvl.toString()).map((digit) => numberToEmoji[digit] || "❓").join("")

let fechaMoment, formatDate, nombreLugar, ciudad = null
const phoneNumber = '+' + m.sender
const parsedPhoneNumber = parsePhoneNumber(phoneNumber)
const countryCode = parsedPhoneNumber.country
const countryData = ct.getCountry(countryCode)
const timezones = countryData.timezones
const zonaHoraria = timezones.length > 0 ? timezones[0] : 'UTC'
moment.locale(mid.idioma_code)
let lugarMoment = moment().tz(zonaHoraria)
if (lugarMoment) {
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = countryData.name
const partes = zonaHoraria.split('/')
ciudad = partes[partes.length - 1].replace(/_/g, ' ')
}else{
lugarMoment = moment().tz('America/Lima')
fechaMoment = lugarMoment.format('llll [(]a[)]')
formatDate = fechaMoment.charAt(0).toUpperCase() + fechaMoment.slice(1) 
nombreLugar = 'America'
ciudad = 'Lima'
}	
let margen = '*··················································*'
let menu = `${lenguajeGB['smsConfi2']()} *${user.genero === 0 ? '👤' : user.genero == 'Ocultado 🕶️' ? `🕶️` : user.genero == 'Mujer 🚺' ? `🚺` : user.genero == 'Hombre 🚹' ? `🚹` : '👤'} ${user.registered === true ? user.name : taguser}* ${(conn.user.jid == global.conn.user.jid ? '' : `\n*SOY SUB BOT DE: https://wa.me/${global.conn.user.jid.split`@`[0]}*`) || ''}

> *_${formatDate}_*
> \`${nombreLugar} - ${ciudad}\`

${margen}

> 🌟 *INFORMACIÓN GENERAL* 🌟 

*❰❰ ${lenguajeGB['smsTotalUsers']()} ❱❱* 
➺ \`\`\`${Object.keys(global.db.data.users).length}\`\`\`

*❰❰ Registrados ❱❱* 
➺ \`\`\`${rtotalreg}/${totalreg}\`\`\`    

*❰❰ ${lenguajeGB['smsUptime']()} ❱❱* 
➺ \`\`\`${uptime}\`\`\`

*❰❰ ${lenguajeGB['smsVersion']()} ❱❱* 
➺ \`\`\`${vs}\`\`\`

*❰❰ ${lenguajeGB['smsMode']()} ❱❱* 
➺ \`${global.opts['self'] ? `${lenguajeGB['smsModePrivate']().charAt(0).toUpperCase() + lenguajeGB['smsModePrivate']().slice(1).toLowerCase()}` : `${lenguajeGB['smsModePublic']().charAt(0).toUpperCase() + lenguajeGB['smsModePublic']().slice(1).toLowerCase()}`}\`

*❰❰ ${lenguajeGB['smsBanChats']()} ❱❱* 
➺ \`\`\`${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}\`\`\`

*❰❰ ${lenguajeGB['smsBanUsers']()} ❱❱* 
➺ \`\`\`${Object.entries(global.db.data.users).filter(user => user[1].banned).length}\`\`\`

${margen}

> ✨ *INFORMACIÓN DEL USUARIO* ✨

*❰❰ Tipo de registro ❱❱*
➺ ${user.registered === true ? `_${user.registroC === true ? '🗂️ Registro Completo' : '📑 Registro Rápido'}_` : '❌ _Sin registro_'}

*❰❰ Mi estado ❱❱*
➺ ${typeof user.miestado !== 'string' ? '❌ *Establecer usando:* _' + usedPrefix + 'miestado_' : '_Me siento ' + user.miestado + '_'}

*❰❰ Registrado ❱❱*
➺ ${user.registered === true ? '✅ Verificado' : '❌ *Establecer registro usando:* _' + usedPrefix + 'verificar_'}

*❰❰ ${lenguajeGB['smsBotonM7']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM7']().slice(1).toLowerCase()} ❱❱* 
➺ ${user.premiumTime > 0 ? '✅ Eres usuario Premium' : '❌ *Establecer Premium:* _' + usedPrefix + 'pase premium_'}

*❰❰ ${lenguajeGB['smsBotonM5']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM5']().slice(1).toLowerCase()} ❱❱* 
➺ ${role}

*❰❰ ${lenguajeGB['smsBotonM6']().charAt(0).toUpperCase() + lenguajeGB['smsBotonM6']().slice(1).toLowerCase()} ❱❱*
➺ ${emoji} \`${user.exp - min}/${xp}\`

*❰❰ ${lenguajeGB['smsPareja']()} ❱❱*
➺ ${pareja ? `${name} 💕 ${conn.getName(pareja)}` : `🛐 ${lenguajeGB['smsResultPareja']()}`}

*❰❰ Pasatiempo(s) ❱❱* 
➺ ${user.pasatiempo === 0 ? '*Sin Registro*' : user.pasatiempo + '\n'}

${margen}

> 💫 *INFORMACIÓN* 💫\n
${generateCommand(commandsInfo, usedPrefix)}

${margen}

> 💻 *COMANDOS - SUB BOT*\n
${generateCommand(commandsJadiBot, usedPrefix)}

${margen}

> 🆘 *REPORTAR COMANDOS* 🆘\n
${generateCommand(commandsReport, usedPrefix)}

${margen}

> 🪅 *GATABOT TEMPORAL* 🪅\n
${generateCommand(commandsLink, usedPrefix)}

${margen}

> 🎟️ *SER PREMIUM* 🎟️\n
${generateCommand(commandsPrem, usedPrefix)}

${margen}

> 🎡 *JUEGOS* 🎡\n
${generateCommand(commandsGames, usedPrefix)}

${margen}

> ✨ *IA* ✨\n
${generateCommand(commandsAI, usedPrefix)}

${margen}

> ⚙️ *AJUSTES* ⚙️
${m.isGroup ? `_✅ ➤ Activado_
_❌ ➤ Desactivado_` : `Para ver la configuración completa sólo use: *${usedPrefix}on* o *${usedPrefix}off*`}\n
${generateCommand(commandsConfig, usedPrefix).replace(/≡/g, '𖡡')}

${margen}

> 🧾 *AJUSTES/INFO - GRUPO* 🧾

✓ _${usedPrefix}configuracion_
✓ _${usedPrefix}settings_
✓ _${usedPrefix}vergrupo_

> 🪄 *DESCARGAS* 🪄

✓ _${usedPrefix}imagen | image *texto*_
✓ _${usedPrefix}pinterest | dlpinterest *texto*_
✓ _${usedPrefix}wallpaper|wp *texto*_
✓ _${usedPrefix}play | play2 *texto o link*_
✓ _${usedPrefix}play.1 *texto o link*_
✓ _${usedPrefix}play.2 *texto o link*_ 
✓ _${usedPrefix}ytmp3 | yta *link*_
✓ _${usedPrefix}ytmp4 | ytv *link*_
✓ _${usedPrefix}pdocaudio | ytadoc *link*_
✓ _${usedPrefix}pdocvieo | ytvdoc *link*_
✓ _${usedPrefix}tw |twdl | twitter *link*_
✓ _${usedPrefix}facebook | fb *link*_
✓ _${usedPrefix}instagram *link video o imagen*_
✓ _${usedPrefix}verig | igstalk *usuario(a)*_
✓ _${usedPrefix}ighistoria | igstory *usuario(a)*_
✓ _${usedPrefix}tiktok *link*_
✓ _${usedPrefix}tiktokimagen | ttimagen *link*_
✓ _${usedPrefix}tiktokfoto | tiktokphoto *usuario(a)*_
✓ _${usedPrefix}vertiktok | tiktokstalk *usuario(a)*_
✓ _${usedPrefix}mediafire | dlmediafire *link*_
✓ _${usedPrefix}clonarepo | gitclone *link*_
✓ _${usedPrefix}clima *país ciudad*_
✓ _${usedPrefix}consejo_
✓ _${usedPrefix}morse codificar *texto*_
✓ _${usedPrefix}morse decodificar *morse*_
✓ _${usedPrefix}fraseromantica_
✓ _${usedPrefix}historia_
✓ _${usedPrefix}drive | dldrive *link*_
> 👤 *CHAT ANONIMO* 👤

✓ _${usedPrefix}chatanonimo | anonimochat_
✓ _${usedPrefix}anonimoch_
✓ _${usedPrefix}start_
✓ _${usedPrefix}next_
✓ _${usedPrefix}leave_

> 🌐 *COMANDOS PARA GRUPOS* 🌐

✓ _${usedPrefix}add *numero*_
✓ _${usedPrefix}mute | unmute *@tag*_
✓ _${usedPrefix}sacar | ban | kick  *@tag*_
✓ _${usedPrefix}grupo *abrir o cerrar*_
✓ _${usedPrefix}group *open o close*_
✓ _${usedPrefix}daradmin | promote *@tag*_
✓ _${usedPrefix}quitar | demote *@tag*_
✓ _${usedPrefix}banchat_
✓ _${usedPrefix}unbanchat_
✓ _${usedPrefix}banuser *@tag*_
✓ _${usedPrefix}unbanuser *@tag*_
✓ _${usedPrefix}admins *texto*_
✓ _${usedPrefix}invocar *texto*_
✓ _${usedPrefix}tagall *texto*_
✓ _${usedPrefix}hidetag *texto*_
✓ _${usedPrefix}infogrupo | infogroup_
✓ _${usedPrefix}grupotiempo | grouptime *Cantidad*_
✓ _${usedPrefix}advertencia *@tag*_
✓ _${usedPrefix}deladvertencia *@tag*_
✓ _${usedPrefix}delwarn *@tag*_
✓ _${usedPrefix}crearvoto | startvoto *texto*_
✓ _${usedPrefix}sivotar | upvote_
✓ _${usedPrefix}novotar | devote_
✓ _${usedPrefix}vervotos | cekvoto_
✓ _${usedPrefix}delvoto | deletevoto_
✓ _${usedPrefix}enlace | link_
✓ _${usedPrefix}newnombre | nuevonombre *texto*_
✓ _${usedPrefix}newdesc | descripcion *texto*_
✓ _${usedPrefix}setwelcome | bienvenida *texto*_
✓ _${usedPrefix}setbye | despedida *texto*_
✓ _${usedPrefix}nuevoenlace | resetlink_
✓ _${usedPrefix}on_
✓ _${usedPrefix}off_

> 💞 *PAREJAS* 💞

✓ _${usedPrefix}listaparejas | listship_
✓ _${usedPrefix}mipareja | mylove_
✓ _${usedPrefix}pareja | couple *@tag*_
✓ _${usedPrefix}aceptar | accept *@tag*_
✓ _${usedPrefix}rechazar | decline *@tag*_
✓ _${usedPrefix}terminar | finish *@tag*_

> 📦 *VOTACIONES EN GRUPOS* 📦

✓ _${usedPrefix}crearvoto | startvoto *texto*_
✓ _${usedPrefix}sivotar | upvote_
✓ _${usedPrefix}novotar | devote_
✓ _${usedPrefix}vervotos | cekvoto_
✓ _${usedPrefix}delvoto | deletevoto_

> 🔞 *CONTENIDO* 🔞

✓ _${usedPrefix}hornymenu_

> 🔁 *CONVERTIDORES* 🔁

✓ _${usedPrefix}toimg | img | jpg *sticker*_
✓ _${usedPrefix}toanime | jadianime *foto*_
✓ _${usedP
