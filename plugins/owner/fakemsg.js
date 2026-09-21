let handler = async (m, { conn, text }) => {
  if (!m.quoted) return m.reply('Reply pesan yang ingin dijadikan target.')
  if (!text) return m.reply('Masukkan teks.\nContoh: .fakemsg hai')

  try {
    const sent = await conn.sendMessage(m.chat, { text: '' })

    await conn.sendMessage(
      m.chat,
      {
        text: text,
        edit: sent.key
      }
    )
  } catch (e) {
    m.reply(String(e))
  }
}

handler.help = ['fakemsg <teks>']
handler.tags = ['owner']
handler.command = /^fakemsg$/i
handler.owner = true

export default handler