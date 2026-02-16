/**
 * Email service using MailerLite API
 * Direct API calls using fetch
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using MailerLite REST API
 */
async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const fromEmail = process.env.MAILERLITE_FROM_EMAIL || 'noreply@internetowyprzedsiebiorca.pl';

  if (!apiKey) {
    throw new Error('MAILERLITE_API_KEY is not configured');
  }

  try {
    // MailerLite API v2 - Send transactional email
    const response = await fetch('https://connect.mailerlite.com/api/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to: to,
        from: {
          email: fromEmail,
          name: 'Klub Internetowy Przedsiębiorca',
        },
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MailerLite API error:', error);
      throw new Error(`MailerLite API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Nie udało się wysłać emaila');
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0F172A;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F172A; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1E293B; border-radius: 12px; border: 1px solid #334155; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #334155;">
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">
                    KLUB <span style="color: #F97316;">IP</span>
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #FFFFFF; font-size: 20px; font-weight: 600;">
                    Reset hasła
                  </h2>
                  <p style="margin: 0 0 20px; color: #CBD5E1; font-size: 16px; line-height: 1.6;">
                    Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta. Kliknij przycisk poniżej, aby ustawić nowe hasło:
                  </p>

                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #F97316; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          Resetuj hasło
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 10px; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                    Jeśli przycisk nie działa, skopiuj i wklej poniższy link do przeglądarki:
                  </p>
                  <p style="margin: 0; color: #F97316; font-size: 14px; word-break: break-all;">
                    ${resetLink}
                  </p>

                  <div style="margin-top: 30px; padding: 20px; background-color: #0F172A; border-radius: 8px; border: 1px solid #334155;">
                    <p style="margin: 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #F97316;">⏰ Ważne:</strong> Link wygasa za 1 godzinę.
                    </p>
                    <p style="margin: 10px 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                      Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #334155;">
                  <p style="margin: 0; color: #64748B; font-size: 14px;">
                    © ${new Date().getFullYear()} Internetowy Przedsiębiorca<br>
                    <a href="${process.env.NEXTAUTH_URL}/terms" style="color: #F97316; text-decoration: none;">Regulamin</a> •
                    <a href="${process.env.NEXTAUTH_URL}/privacy" style="color: #F97316; text-decoration: none;">Polityka Prywatności</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Reset hasła - Klub IP',
    html,
  });
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(to: string, verificationToken: string) {
  const verifyLink = `${process.env.NEXTAUTH_URL}/verify-email/${verificationToken}`;

  const html = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0F172A;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F172A; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1E293B; border-radius: 12px; border: 1px solid #334155; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #334155;">
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">
                    KLUB <span style="color: #F97316;">IP</span>
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px; color: #FFFFFF; font-size: 20px; font-weight: 600;">
                    Witaj w Klubie! 🎉
                  </h2>
                  <p style="margin: 0 0 20px; color: #CBD5E1; font-size: 16px; line-height: 1.6;">
                    Dziękujemy za rejestrację! Aby aktywować swoje konto, kliknij przycisk poniżej:
                  </p>

                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verifyLink}" style="display: inline-block; padding: 14px 32px; background-color: #F97316; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          Potwierdź email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 10px; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                    Jeśli przycisk nie działa, skopiuj i wklej poniższy link do przeglądarki:
                  </p>
                  <p style="margin: 0; color: #F97316; font-size: 14px; word-break: break-all;">
                    ${verifyLink}
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #334155;">
                  <p style="margin: 0; color: #64748B; font-size: 14px;">
                    © ${new Date().getFullYear()} Internetowy Przedsiębiorca<br>
                    <a href="${process.env.NEXTAUTH_URL}/terms" style="color: #F97316; text-decoration: none;">Regulamin</a> •
                    <a href="${process.env.NEXTAUTH_URL}/privacy" style="color: #F97316; text-decoration: none;">Polityka Prywatności</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: 'Potwierdź swój email - Klub IP',
    html,
  });
}
