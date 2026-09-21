// plugins/crm.js
// Command: .crm
// Type: ESM Plugin

const plugin = async (m, { conn, usedPrefix, command, isOwner, isPemilik }) => {
    const from = m.chat

    // =========================
    // CEK OWNER / PEMILIK
    // =========================
    if (!isOwner && !isPemilik) {
        return m.reply(
            'fitur khusus owner/pemilik bot sxcwamdv3 ini'
        )
    }

    // =========================
    // CEK REPLY
    // =========================
    if (!m.quoted) {
        return m.reply(
            `Reply pesan target dulu, lalu kirim *${usedPrefix}${command}*`
        )
    }

    // =========================
    // CEK VIEW ONCE
    // =========================
    function crmHasViewOnce(obj, visited = new WeakSet()) {
        if (!obj || typeof obj !== 'object') return false

        // Hindari infinite recursion kalau object punya circular reference
        if (visited.has(obj)) return false
        visited.add(obj)

        if (
            obj.viewOnceMessage ||
            obj.viewOnceMessageV2 ||
            obj.viewOnceMessageV2Extension
        ) {
            return true
        }

        for (const value of Object.values(obj)) {
            if (crmHasViewOnce(value, visited)) {
                return true
            }
        }

        return false
    }

    if (crmHasViewOnce(m.quoted)) {
        return m.reply('❌ Pesan view-once tidak bisa disimpan.')
    }

    // =========================
    // BUAT CRM
    // =========================
    try {
        const crmPayload = JSON.parse(
            JSON.stringify(m.quoted)
        )

        const crmData = {
            type: 'bot-crm-relay',
            version: 1,
            createdAt: new Date().toISOString(),
            creator: global.config?.botname || 'SXCWAMD',
            payload: crmPayload
        }

        const crmCode =
            `module.exports = ${JSON.stringify(crmData, null, 2)};\n`

        // =========================
        // KIRIM FILE
        // =========================
        await conn.sendMessage(
            from,
            {
                document: Buffer.from(crmCode),
                mimetype: 'application/javascript',
                fileName: 'relay.js',
                caption:
                    `✅ *CRM berhasil dibuat*\n\n` +
                    `Reply file ini lalu kirim:\n` +
                    `*${usedPrefix}runcrm*`
            },
            {
                quoted: m
            }
        )

        // =========================
        // REACTION
        // =========================
        await conn.sendMessage(from, {
            react: {
                text: '✅',
                key: m.key
            }
        })

    } catch (e) {
        console.error('CRM ERROR:', e)

        // Kalau fungsi sendAdminLog tersedia di global
        try {
            if (typeof global.sendAdminLog === 'function') {
                await global.sendAdminLog(
                    conn,
                    'crm',
                    m.sender?.split('@')[0] || m.sender,
                    e
                )
            }
        } catch {}

        return m.reply(
            '❌ Gagal membuat CRM.\n\n' +
            (e?.message || String(e))
        )
    }
}

plugin.help = ['crm']
plugin.tags = ['owner']
plugin.command = /^(crm)$/i
plugin.owner = true

export default plugin