let handler = async (m, { conn, isOwner }) => {
    // Si es un grupo o es owner, ignorar
    if (m.chat.endsWith('@g.us') || isOwner) return
    
    // Si no hay texto o no es un comando, ignorar
    if (!m.text || !['.', '#', '/'].some(prefix => m.text.startsWith(prefix))) return
    
    // Mensaje antiprivado
    let texto = `╭══════⊱ ⚠️ ⊱══════╮\n`
    texto += `*NO DISPONIBLE EN PRIVADO*\n`
    texto += `╰══════⊱ ❌ ⊱══════╯\n\n`
    texto += `👉 Únete al grupo oficial para usar el bot:\n`
    texto += `https://chat.whatsapp.com/...\n\n`
    texto += `O contacta a mi creador:\n`
    texto += `wa.me/...\n`
    
    // Enviar mensaje
    m.reply(texto)
    
    // Bloquear después de enviar (opcional)
    // await conn.updateBlockStatus(m.sender, 'block')
    
    return !0
}

handler.private = true
export default handler
