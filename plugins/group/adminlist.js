let handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('❌ Fitur ini hanya bisa digunakan di grup.')

  let metadata
  try {
    metadata = await conn.groupMetadata(m.chat)
  } catch (e) {
    return m.reply('❌ Gagal mengambil data grup.')
  }

  let participants = metadata.participants || []

  // ambil admin (admin & superadmin)
  let admins = participants
    .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
    .map(p => p.id)

  if (admins.length === 0) return m.reply('❌ Tidak ada admin di grup ini.')

  let text = `👑 *DAFTAR ADMIN GRUP*\n\n`
  text += admins.map((jid, i) => {
    return `${i + 1}. @${jid.split('@')[0]}`
  }).join('\n')

  text += `\n\n📊 Total admin: ${admins.length}`

  await conn.sendMessage(m.chat, {
    text,
    mentions: admins
  }, { quoted: m })
}

handler.command = ['adminlist']
handler.group = true

export default handler