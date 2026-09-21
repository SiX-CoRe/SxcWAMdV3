let handler = async (m, { conn }) => {
  if (!m.quoted) throw 'Balas pesan yang ingin dipin!'

  await conn.sendMessage(m.chat, {
    pin: {
      remoteJid: m.quoted.chat,
      fromMe: false,
      id: m.quoted.id,
      participant: m.quoted.sender
    },
    type: 1
  })

  m.reply('📌 Pesan berhasil dipin.')
}

handler.help = ['pinpesan']
handler.tags = ['group']
handler.command = ['pinpesan']

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler