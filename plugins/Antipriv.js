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
