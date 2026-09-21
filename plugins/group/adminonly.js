let handler = async (m, { args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('❌ Fitur ini hanya untuk grup!')
  if (!isAdmin && !isOwner) return m.reply('🚫 Khusus admin grup!')

  let chat = global.db.data.chats[m.chat] ||= {}

  let input = (args[0] || '').toLowerCase()

  if (!input) {
    return m.reply(`🛡️ *Admin Only Settings*

Status: ${chat.adminOnly ? 'ON ✅' : 'OFF ❌'}

Gunakan:
• .adminonly on
• .adminonly off`)
  }

  if (input === 'on') {
    chat.adminOnly = true
    return m.reply('✅ AdminOnly berhasil diaktifkan')
  }

  if (input === 'off') {
    chat.adminOnly = false
    return m.reply('❌ AdminOnly berhasil dimatikan')
  }

  return m.reply('⚠️ Gunakan *on* atau *off*')
}

handler.help = ['adminonly']
handler.tags = ['group']
handler.command = ['adminonly']
handler.group = true

export default handler