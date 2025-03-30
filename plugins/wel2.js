
import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://qu.ax/TMEaZ.jpg')
  let img = await (await fetch(`${pp}`)).buffer()

    if (chat.antiLink && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `╭━━━━━━⋆★⋆━━━━━━─
┃ ⏤͟͟͞͞𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗢 🌟
┃ 👤 ${taguser}
┃ 
┃ 🏆 𝗔𝗟 𝗚𝗥𝗨𝗣𝗢 : 
┃ ${groupMetadata.subject}
┃ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ 
╰━━━━━━⋆★⋆━━━━━━─`
      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] })
    }
       
    if (chat.antiLink && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let bye = `╭━━━━━━━━━━━━━━━╮
│      _- 1_ 𝙄𝙉𝙎𝙀𝙍𝙑𝙄𝘽𝙇𝙀   
│        ${taguser}    
╰━━━━━━━━━━━━━━━╯
 𝙋𝙨𝙙𝙩: 𝘌𝘴𝘤𝘶𝘱𝘢𝘯𝘭𝘦 𝘦𝘯 𝘦𝘴𝘢 𝘤𝘢𝘳𝘢 𝘱𝘰𝘳 𝘢𝘥𝘰𝘳𝘯𝘰 𝘦𝘯 𝘦𝘭 𝘨𝘳𝘶𝘱𝘰 𝘹𝘥.

 - 𝙀𝙡𝙞𝙩𝙚 𝘽𝙤𝙩 𝙂𝙡𝙤𝙗𝙖𝙡`
      await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [who] })
    }

    if (chat.antiLink && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) { 
      let kick = `╭━━━━━━━━━━━━━━━╮
│      _- 1_ 𝙄𝙉𝙎𝙀𝙍𝙑𝙄𝘽𝙇𝙀   
│        ${taguser}    
╰━━━━━━━━━━━━━━━╯`
      await conn.sendMessage(m.chat, { image: img, caption: kick, mentions: [who] })
  }}
