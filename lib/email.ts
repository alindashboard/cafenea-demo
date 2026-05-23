import { Resend } from 'resend'
import { SITE_CONFIG } from '@/lib/config'

const FROM = `${SITE_CONFIG.business.name} <onboarding@resend.dev>`

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

interface ContactEmailData {
  name: string
  phone: string
  email: string
  message: string
}

function contactHtml(d: ContactEmailData) {
  const { url, business } = SITE_CONFIG
  return `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5E8D8;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5E8D8;padding:32px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFF9F0;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(44,24,16,.12)">
        <tr>
          <td style="background:#2C1810;padding:24px 32px">
            <p style="margin:0;color:#FDF6EE;font-family:Georgia,serif;font-size:22px;font-weight:700">&#9749; ${esc(business.name)}</p>
            <p style="margin:4px 0 0;color:#D4956A;font-size:13px;font-family:sans-serif">Mesaj nou prin formular de contact</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #F0E4D4;color:#7A5C4A;font-size:14px;width:130px;font-family:sans-serif">Nume</td>
                <td style="padding:10px 0;border-bottom:1px solid #F0E4D4;font-weight:700;font-size:14px;color:#1A0F0A;font-family:sans-serif">${esc(d.name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #F0E4D4;color:#7A5C4A;font-size:14px;font-family:sans-serif">Telefon</td>
                <td style="padding:10px 0;border-bottom:1px solid #F0E4D4;font-size:14px;font-family:sans-serif">
                  <a href="tel:${esc(d.phone)}" style="color:#D4956A;font-weight:700;text-decoration:none">${esc(d.phone)}</a>
                </td>
              </tr>
              ${d.email ? `<tr>
                <td style="padding:10px 0;border-bottom:1px solid #F0E4D4;color:#7A5C4A;font-size:14px;font-family:sans-serif">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #F0E4D4;font-size:14px;font-family:sans-serif">
                  <a href="mailto:${esc(d.email)}" style="color:#D4956A;text-decoration:none">${esc(d.email)}</a>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 0;color:#7A5C4A;font-size:14px;vertical-align:top;font-family:sans-serif">Mesaj</td>
                <td style="padding:10px 0;font-size:14px;color:#1A0F0A;line-height:1.7;font-family:sans-serif">${esc(d.message).replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
            <div style="margin-top:24px;padding:14px 18px;background:#FDF6EE;border-radius:10px;border-left:4px solid #D4956A">
              <p style="margin:0;font-size:13px;color:#5A3D2E;font-family:sans-serif">
                Intr&#259; &#238;n <a href="${url}/admin/dashboard" style="color:#D4956A;font-weight:600;text-decoration:none">panoul de admin</a> pentru a marca mesajul ca rezolvat.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#2C1810">
            <p style="margin:0;font-size:12px;color:#9C7B6A;font-family:sans-serif">${esc(business.name)} &middot; ${esc(business.address)} &middot; ${esc(business.phoneDisplay)}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendContactEmail(data: ContactEmailData) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL
  if (!apiKey || !adminEmail) return

  const resend = new Resend(apiKey)
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Contact nou: ${data.name} — ${data.phone}`,
    html: contactHtml(data),
  })
}
