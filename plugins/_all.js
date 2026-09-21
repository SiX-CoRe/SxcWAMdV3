let handler = m => m

handler.all = async function (m) {
  let chat = global.db.data.chats[m.chat]
  if (!chat) return

  // ======================
  // AUTO UNBAN
  // ======================
  if (chat.isBanned && chat.banExpired) {
    if (Date.now() > chat.banExpired) {
      chat.isBanned = false
      delete chat.banExpired
      delete chat.banReason

      return this.sendMessage(m.chat, {
        text: '✅ Grup sudah di-unban otomatis!'
      })
    }
  }

  // ======================
  // SAAT MASIH KEBAN
  // ======================
  if (chat.isBanned) {

    // hanya trigger kalau command
    let prefix = /^[.!#/]/ // sesuaikan prefix bot kamu
    if (!m.text || !prefix.test(m.text)) return

    // skip kalau cuma "." doang
    if (m.text.trim().length === 1) return

    let sisa = chat.banExpired - Date.now()

    let h = Math.floor(sisa / 3600000)
    let mnt = Math.floor((sisa % 3600000) / 60000)
    let s = Math.floor((sisa % 60000) / 1000)

    let timeLeft = `${h} jam ${mnt} menit ${s} detik`

    // anti spam notif
    if (!chat.lastBanNotif || Date.now() - chat.lastBanNotif > 5000) {
      chat.lastBanNotif = Date.now()

      await this.sendMessage(m.chat, {
        text: `🚫 *GRUP SEDANG DI BAN*\n\n📝 Alasan: ${chat.banReason || '-'}\n⏱️ Sisa: ${timeLeft}`
      })
    }

    return
  }
}

export default handler