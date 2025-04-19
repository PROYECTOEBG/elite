import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

var handler = async (m, { conn, usedPrefix }) => {

// Texto principal con el formato de tu imagen
const listText = `*MODALIDAD:* CLK  
*ROPA:* verde  

*Escuadra 1:*  
➡ @Bolillo  
➡ ➢  
➡ ➢  
➡ ➢  

*Escuadra 2:*  
➡ ➢ @Carito  
➡ ➢  
➡ ➢  
➡ ➢  
➡ ➢  

*SUPLENTE:*  
➡ ➢  
➡ ➢  
➡ ➢  

*BOLLLOBOT / MELDEXZZ.*`;

let msg = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: listText
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "Selecciona una opción:"
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Escuadra 1",
                  "id": "esc1"
                })
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Escuadra 2",
                  "id": "esc2"
                })
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Suplente",
                  "id": "suplente"
                })
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Limpiar lista",
                  "id": "limpiar"
                })
              }
            ],
          })
        })
    }
  }
}, {})

await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })

// Manejar las respuestas a los botones
conn.ev.on('messages.upsert', async ({ messages }) => {
  const message = messages[0]
  if (message?.message?.buttonsResponseMessage) {
    const selectedId = message.message.buttonsResponseMessage.selectedButtonId
    const sender = message.pushName || message.key.participant.split('@')[0]
    
    let responseText = ''
    switch(selectedId) {
      case 'esc1':
        responseText = `*${sender}* ha seleccionado *Escuadra 1*`
        break
      case 'esc2':
        responseText = `*${sender}* ha seleccionado *Escuadra 2*`
        break
      case 'suplente':
        responseText = `*${sender}* ha seleccionado *Suplente*`
        break
      case 'limpiar':
        responseText = `*${sender}* ha limpiado la lista`
        break
    }
    
    if (responseText) {
      await conn.sendMessage(m.chat, { text: responseText }, { quoted: message })
    }
  }
})

}

handler.command = /^(listaff)$/i

export default handler;
