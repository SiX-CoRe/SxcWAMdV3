let handler = async (m, { conn }) => {
    if (!m.quoted) return m.reply('📌 Reply status grup yang ingin dihapus!\n\nContoh: .delswgc (reply status)')

    try {
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.quoted.id,
                participant: m.quoted.sender,
            }
        })
        
        return m.reply('✅ Status berhasil dihapus!')
    } catch (e) {
        console.error('Error:', e)
        return m.reply('❌ Gagal menghapus status.\n\nPastikan bot adalah admin grup dan reply ke pesan status yang benar.')
    }
}

handler.command = ['delswgc']
handler.admin = true

export default handler