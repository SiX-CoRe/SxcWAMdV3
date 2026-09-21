let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('Khusus grup.')

  // Admin grup ATAU owner bot boleh akses
  if (!isAdmin && !isOwner) {
    return m.reply('Fitur ini khusus admin grup atau owner bot.')
  }

  global.db.data.chats[m.chat] ??= {}
  let chat = global.db.data.chats[m.chat]

  if (!args[0]) {
    return m.reply(
`Contoh:
.autogpt on
.autogpt off`
    )
  }

  let type = args[0].toLowerCase()

  if (type === 'on') {
    chat.autogpt = true
    return m.reply(
`Auto Sxcwamd berhasil diaktifkan.`
    )
  }

  if (type === 'off') {
    chat.autogpt = false
    return m.reply(
`yahhhh di matiin auto nya`
    )
  }

  return m.reply('Pilih on / off')
}

handler.help = ['autogpt']
handler.tags = ['group']
handler.command = /^(autogpt|autoanya)$/i

handler.group = true
// Jangan pakai handler.admin = true
// Biar owner bot tetap bisa akses walaupun bukan admin grup

export default handler