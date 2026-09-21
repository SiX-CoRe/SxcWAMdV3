import fetch from "node-fetch";

const API_GEMPA = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";

async function cekGempa(conn) {
  try {
    let db = global.db.data;

    if (!db.others) db.others = {};
    if (!db.others.notifGempa) db.others.notifGempa = {};

    let setting = db.others.notifGempa;

    let lastGempa = setting.lastDateTime || null;

    const res = await fetch(API_GEMPA, { timeout: 15000 });
    const data = await res.json();

    const g = data?.Infogempa?.gempa;
    if (!g) return;

    // skip kalau sama
    if (lastGempa === g.DateTime) return;

    setting.lastDateTime = g.DateTime;

    const text = `
🌍 *UPDATE GEMPA BMKG*

◦ *Tanggal:* ${g.Tanggal}
◦ *Jam:* ${g.Jam}
◦ *Wilayah:* ${g.Wilayah}
◦ *Magnitudo:* ${g.Magnitude}
◦ *Kedalaman:* ${g.Kedalaman}
◦ *Potensi:* ${g.Potensi}
◦ *Dirasakan:* ${g.Dirasakan}

🔍 Sumber: https://bmkg.go.id
`.trim();

    const chats = db.chats || {};

    for (const jid in chats) {
      let chat = chats[jid];

      // ❌ skip kalau ga aktif
      if (!chat.updategempa) continue;

      // ❌ mode grup only
      if (setting.groupOnly && !jid.endsWith("@g.us")) continue;

      // ❌ filter wilayah
      if (setting.filterWilayah) {
        let wilayah = g.Wilayah.toLowerCase();
        let filter = setting.filterWilayah.toLowerCase();

        if (!wilayah.includes(filter)) continue;
      }

      await conn.sendMessage(jid, {
        image: { url: `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}` },
        caption: text
      }).catch(() => {});
    }

  } catch (e) {
    console.error("Error cek gempa:", e);
  }
}

let handler = async (m, { args }) => {
  let db = global.db.data;

  if (!db.others) db.others = {};
  if (!db.others.notifGempa) {
    db.others.notifGempa = {
      groupOnly: false,
      filterWilayah: ""
    };
  }

  let setting = db.others.notifGempa;

  let chats = db.chats;
  let chat = chats[m.chat];

  let cmd = (args[0] || "").toLowerCase();

  if (cmd === "on") {
    chat.updategempa = true;
    return m.reply("✅ Notifikasi gempa *AKTIF* di chat ini");
  }

  if (cmd === "off") {
    chat.updategempa = false;
    return m.reply("❌ Notifikasi gempa *NONAKTIF* di chat ini");
  }

  if (cmd === "group") {
    setting.groupOnly = true;
    return m.reply("👥 Mode grup saja *AKTIF*");
  }

  if (cmd === "all") {
    setting.groupOnly = false;
    return m.reply("🌐 Kirim ke semua chat *AKTIF*");
  }

  if (cmd === "set") {
    let wilayah = args.slice(1).join(" ");
    if (!wilayah) return m.reply("Contoh: .gempa set jawa barat");

    setting.filterWilayah = wilayah;
    return m.reply(`📍 Filter wilayah di set ke: *${wilayah}*`);
  }

  if (cmd === "clear") {
    setting.filterWilayah = "";
    return m.reply("🧹 Filter wilayah dihapus");
  }

  // default menu
  m.reply(`
🌍 *SETTING NOTIF GEMPA*

.gempa on → aktifkan di chat
.gempa off → nonaktifkan

.gempa group → hanya grup
.gempa all → semua chat

.gempa set <wilayah>
.gempa clear

Contoh:
.gempa set jawa barat
`);
};

// 🔥 AUTO LOOP (ANTI DOUBLE + AMAN)
handler.before = async function (m, { conn }) {
  if (global.gempaLoop) return;

  console.log("🌍 Monitor gempa aktif...");

  global.gempaLoop = setInterval(() => {
    cekGempa(conn);
  }, 60 * 1000); // 1 menit
};

handler.help = ["gempa"];
handler.tags = ["tools"];
handler.command = /^gempa$/i;

export default handler;