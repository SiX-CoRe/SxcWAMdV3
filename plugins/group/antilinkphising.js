/** 
Fitur : Anti Link Phising dengan Custom Add 
Admin bisa menambahkan link phising baru yang beredar ke dalam database grup.
*/

let handler = async (m, { args, isAdmin, isOwner, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply("Fitur ini hanya dapat digunakan dalam grup.")
  if (!(isAdmin || isOwner)) return m.reply("Maaf, fitur ini hanya dapat digunakan oleh admin grup.")

  // Inisialisasi database grup
  global.db.data.chats = global.db.data.chats || {}
  let chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {}
  
  // Inisialisasi array untuk menyimpan daftar link phising custom
  chat.phisingList = chat.phisingList || []

  if (!args[0]) {
    return m.reply(`Gunakan format:\n*${usedPrefix + command} on / off*\n*${usedPrefix + command} add [link/kata]*\n*${usedPrefix + command} del [link/kata]*\n*${usedPrefix + command} list*`)
  }

  let action = args[0].toLowerCase()

  switch (action) {
    case "on":
      if (chat.antiphising) return m.reply("Anti phising sudah aktif.")
      chat.antiphising = true
      m.reply("✅ Anti phising berhasil diaktifkan.")
      break

    case "off":
      if (!chat.antiphising) return m.reply("Anti phising sudah nonaktif.")
      chat.antiphising = false
      m.reply("❌ Anti phising berhasil dinonaktifkan.")
      break

    case "add":
      let linkToAdd = args.slice(1).join(" ")
      if (!linkToAdd) return m.reply(`Masukkan link atau kata phising yang ingin diblokir!\nContoh: *${usedPrefix + command} add bit.ly/hadiah-gratis*`)
      
      if (chat.phisingList.includes(linkToAdd.toLowerCase())) return m.reply("Link/kata tersebut sudah ada di daftar blokir grup ini.")
      
      chat.phisingList.push(linkToAdd.toLowerCase())
      m.reply(`✅ Berhasil menambahkan *'${linkToAdd}'* ke daftar blokir phising.`)
      break

    case "del":
    case "delete":
    case "remove":
      let linkToDel = args.slice(1).join(" ").toLowerCase()
      if (!linkToDel) return m.reply(`Masukkan link atau kata yang ingin dihapus!\nContoh: *${usedPrefix + command} del bit.ly/hadiah-gratis*`)
      
      let index = chat.phisingList.indexOf(linkToDel)
      if (index !== -1) {
        chat.phisingList.splice(index, 1)
        m.reply(`❌ Berhasil menghapus *'${linkToDel}'* dari daftar blokir.`)
      } else {
        m.reply("Link/kata tersebut tidak ditemukan di daftar blokir.")
      }
      break

    case "list":
      if (chat.phisingList.length === 0) return m.reply("Daftar blokir phising di grup ini masih kosong.")
      
      let listTxt = "*Daftar Link/Kata Phising (Custom Group):*\n\n"
      chat.phisingList.forEach((v, i) => {
        listTxt += `${i + 1}. ${v}\n`
      })
      m.reply(listTxt.trim())
      break

    default:
      m.reply(`Opsi tidak valid.\nGunakan format:\n*${usedPrefix + command} on / off*\n*${usedPrefix + command} add [link/kata]*\n*${usedPrefix + command} del [link/kata]*\n*${usedPrefix + command} list*`)
  }
}

handler.before = async (m, { conn, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return // Bot harus jadi admin untuk bisa hapus pesan
  if (!m.text) return // Abaikan jika bukan pesan teks

  global.db.data.chats = global.db.data.chats || {}
  let chat = global.db.data.chats[m.chat] || {}

  // Jika fitur dimatikan, abaikan
  if (!chat.antiphising) return

  let text = m.text.toLowerCase()
  
  // Daftar phising bawaan (bisa kamu modifikasi sendiri di script)
  const defaultPhising = [
    "linkdana.id", 
    "dana-kaget", 
    "hadiah-gratis", 
    "pulsa-gratis", 
    "kuota-gratis",
    "bantuan-pemerintah"
  ]

  // Gabungkan daftar bawaan dengan daftar custom dari grup
  const groupPhisingList = chat.phisingList || []
  const allPhisingKeywords = [...defaultPhising, ...groupPhisingList]

  // Cek apakah pesan mengandung salah satu kata/link dari daftar blokir
  let isPhising = allPhisingKeywords.some(keyword => text.includes(keyword))

  if (!isPhising) return

  // Eksekusi hapus pesan
  try {
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.sender
      }
    })
  } catch (err) {
    console.error("Gagal menghapus pesan phising:", err)
  }

  // Berikan peringatan ke member yang mengirim
  let who = m.sender
  let tag = `@${who.split('@')[0]}`

  return conn.sendMessage(m.chat, {
    text: `⚠️ Peringatan untuk ${tag}!\n\nSistem mendeteksi adanya link/indikasi phising. Pesan kamu dihapus secara otomatis untuk keamanan grup.`,
    mentions: [who]
  })
}

handler.command = /^antiphising$/i
handler.help = ["antiphising"]
handler.tags = ["group"]
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler