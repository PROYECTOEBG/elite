import chalk from 'chalk'
import { promises as fs } from 'fs'
import path from 'path'
import './_content.js'

// Definición de variables esenciales
const fkontak = {
    key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast'
    },
    message: {
        contactMessage: {
            displayName: 'EliteBot',
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;EliteBot;;;\nFN:EliteBot\nORG:EliteBot;\nTEL;type=CELL;type=VOICE;waid=0:0\nEND:VCARD`
        }
    }
}

// Handler principal
let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
    // Validaciones iniciales
    if (!m.messageStubType || !m.isGroup) return

    const chat = global.db.data.chats[m.chat]
    const usuario = `@${m.sender.split`@`[0]}`
    const groupAdmins = participants.filter(p => p.admin)
    const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')
    const pp = await conn.profilePictureUrl(m.messageStubParameters?.[0], 'image').catch(_ => null)

    // Sistema de detección de eventos
    if (chat.detect) {
        switch (m.messageStubType) {
            case 2: // Eliminación de sesión
                const uniqid = m.chat.split('@')[0]
                const sessionPath = './GataBotSession/'
                try {
                    for (const file of await fs.readdir(sessionPath)) {
                        if (file.includes(uniqid)) {
                            await fs.unlink(path.join(sessionPath, file))
                            console.log(chalk.yellow.bold('[⚠️] Archivo eliminado:'), chalk.green(file))
                        }
                    }
                } catch (e) {
                    console.error(chalk.red.bold('[ERROR]'), e)
                }
                break

            case 21: // Cambio de ícono
            case 22: // Cambio de título
            case 23: // Cambio de descripción
            case 24: // Cambio de configuración
            case 25: // Mensaje de anuncio
            case 26: // Restricción de grupo
            case 29: // Eliminación de admin
            case 30: // Promoción de admin
            case 72: // Modificación de configuración
            case 123: // Otro evento
                await conn.sendMessage(m.chat, { 
                    text: lenguajeGB['smsAvisoIIG']() + mid[`smsAutodetec${m.messageStubType}`](usuario, m, groupMetadata),
                    mentions: [m.sender, ...groupAdmins.map(v => v.id)]
                }, { quoted: m })
                break

            case 27: // Bienvenida
                if (chat.welcome && this.user.jid !== global.conn.user.jid) {
                    await handleWelcome(m, conn, chat, groupMetadata, pp)
                }
                break

            case 28: // Despedida
            case 32: // Eliminación de miembro
                if (chat.welcome && this.user.jid !== global.conn.user.jid) {
                    await handleGoodbye(m, conn, chat, groupMetadata, pp)
                }
                break

            case 172: // Solicitud de unirse
                if (m.messageStubParameters?.length > 0) {
                    await handleJoinRequest(m, conn, chat, isBotAdmin)
                }
                break
        }
    }
}

// Funciones auxiliares
async function handleWelcome(m, conn, chat, groupMetadata, pp) {
    const userName = m.messageStubParameters[0].split('@')[0]
    const defaultWelcome = `*╔══════════════*\n*╟* ¡BIENVENIDO/A!\n*╟* ${groupMetadata.subject}\n*╟👤 @${userName}*\n*╚══════════════*`
    
    const textWel = chat.sWelcome 
        ? chat.sWelcome
            .replace(/@user/g, `@${userName}`)
            .replace(/@group/g, groupMetadata.subject)
            .replace(/@desc/g, groupMetadata.desc || "Sin descripción")
        : defaultWelcome

    await conn.sendMessage(m.chat, { 
        text: textWel,
        mentions: [m.sender, m.messageStubParameters[0]],
        contextInfo: {
            forwardingScore: 9999999,
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: true,
                renderLargerThumbnail: true,
                thumbnailUrl: pp,
                title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
                mediaType: 1
            }
        }
    }, { quoted: m })
}

async function handleGoodbye(m, conn, chat, groupMetadata, pp) {
    const userName = m.messageStubParameters[0].split('@')[0]
    const defaultBye = `*╔══════════════*\n*╟* ¡ADIÓS! 👋\n*╟👤 @${userName}*\n*╚══════════════*`
    
    const textBye = chat.sBye 
        ? chat.sBye
            .replace(/@user/g, `@${userName}`)
            .replace(/@group/g, groupMetadata.subject)
        : defaultBye

    await conn.sendMessage(m.chat, { 
        text: textBye,
        mentions: [m.sender, m.messageStubParameters[0]],
        contextInfo: {
            forwardingScore: 9999999,
            isForwarded: true,
            externalAdReply: {
                showAdAttribution: true,
                renderLargerThumbnail: true,
                thumbnailUrl: pp,
                title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
                mediaType: 1
            }
        }
    }, { quoted: m })
}

async function handleJoinRequest(m, conn, chat, isBotAdmin) {
    const rawUser = m.messageStubParameters[0]
    const prefijosProhibidos = ['91', '92', '222', '93', '265', '61', '62', '966', '229', '40', '49', '20', '963', '967', '234', '210', '212']
    const action = chat.antifake && isBotAdmin && prefijosProhibidos.some(prefijo => rawUser.startsWith(prefijo)) 
        ? 'reject' 
        : 'approve'

    try {
        await conn.groupRequestParticipantsUpdate(m.chat, [rawUser], action)
        console.log(chalk.blue.bold(`[AUTO] Solicitud ${action === 'reject' ? 'rechazada' : 'aprobada'} para ${rawUser}`))
    } catch (error) {
        console.error(chalk.red.bold('[ERROR]'), error)
    }
}

export default handler
