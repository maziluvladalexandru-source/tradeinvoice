import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromEmail() {
  return process.env.FROM_EMAIL || "TradeInvoice <noreply@tradeinvoice.com>";
}

/** Shared email wrapper for consistent branding */
function emailLayout(businessName: string, content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f3f4f6;">
    <tr>
      <td style="padding: 32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; width: 100%;">
          <!-- Logo -->
          <tr>
            <td style="padding: 0 0 24px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="width: 36px; height: 36px; background-color: #0f172a; border-radius: 8px; text-align: center; vertical-align: middle; font-size: 18px; font-weight: 700; color: #ffffff;">
                    ${businessName.charAt(0).toUpperCase()}
                  </td>
                  <td style="padding-left: 10px; font-size: 16px; font-weight: 700; color: #111827;">
                    ${businessName}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding: 32px 32px 28px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 0 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                Sent via <a href="https://tradeinvoice.com" style="color: #9ca3af; font-weight: 600; text-decoration: none;">TradeInvoice</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendMagicLink(email: string, url: string) {
  await getResend().emails.send({
    from: getFromEmail(),
    to: email,
    subject: "Sign in to TradeInvoice",
    html: emailLayout("TradeInvoice", `
      <p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.5;">Click the button below to sign in:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
        <tr>
          <td style="background-color: #2563eb; border-radius: 8px; text-align: center;">
            <a href="${url}" style="display: inline-block; padding: 14px 32px; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none;">
              Sign In
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0; font-size: 13px; color: #9ca3af;">This link expires in 15 minutes. If you didn&rsquo;t request this, you can safely ignore this email.</p>
    `),
  });
}

export async function sendInvoiceEmail(
  to: string,
  clientName: string,
  invoiceNumber: string,
  total: string,
  viewUrl: string,
  businessName?: string,
  dueDate?: string
) {
  const from = businessName || "TradeInvoice";
  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: `Invoice ${invoiceNumber} — ${total} from ${from}`,
    html: emailLayout(from, `
      <p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.5;">Hi ${clientName},</p>
      <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.5;">
        You have received a new invoice from <strong>${from}</strong>.
      </p>

      <!-- Invoice Summary Card -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; margin: 0 0 28px;">
        <tr>
          <td style="padding: 20px 24px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="vertical-align: top;">
                  <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; font-weight: 600;">Invoice</p>
                  <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #111827; font-family: 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;">${invoiceNumber}</p>
                </td>
                ${dueDate ? `<td style="vertical-align: top; text-align: right;">
                  <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; font-weight: 600;">Due Date</p>
                  <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${dueDate}</p>
                </td>` : ""}
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-top: 1px solid #e5e7eb;">
              <tr>
                <td style="padding-top: 16px;">
                  <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; font-weight: 600;">Amount Due</p>
                  <p style="margin: 6px 0 0; font-size: 30px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">${total}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 0 24px;">
        <tr>
          <td style="text-align: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background-color: #0f172a; border-radius: 10px; text-align: center;">
                  <a href="${viewUrl}" style="display: inline-block; padding: 16px 44px; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; letter-spacing: 0.01em;">
                    View &amp; Pay Invoice
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0; font-size: 13px; color: #9ca3af; text-align: center; line-height: 1.5;">
        Or copy this link:<br>
        <a href="${viewUrl}" style="color: #6b7280; word-break: break-all; font-size: 12px;">${viewUrl}</a>
      </p>
    `),
  });
}

export async function sendInvoiceViewedNotification(
  contractorEmail: string,
  invoiceNumber: string,
  clientName: string
) {
  await getResend().emails.send({
    from: getFromEmail(),
    to: contractorEmail,
    subject: `Invoice ${invoiceNumber} was viewed by ${clientName}`,
    html: emailLayout("TradeInvoice", `
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tr>
          <td style="text-align: center; padding: 8px 0 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="width: 48px; height: 48px; background-color: #eff6ff; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 22px;">&#128065;</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #111827;">Invoice Viewed</h2>
            <p style="margin: 0 0 4px; font-size: 15px; color: #374151; line-height: 1.5;">
              <strong>${clientName}</strong> has viewed invoice <strong style="font-family: monospace;">${invoiceNumber}</strong>.
            </p>
            <p style="margin: 0; font-size: 13px; color: #9ca3af;">Just now</p>
          </td>
        </tr>
      </table>
    `),
  });
}

export async function sendInvoicePaidNotification(
  contractorEmail: string,
  invoiceNumber: string,
  clientName: string
) {
  await getResend().emails.send({
    from: getFromEmail(),
    to: contractorEmail,
    subject: `Invoice ${invoiceNumber} has been paid!`,
    html: emailLayout("TradeInvoice", `
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
        <tr>
          <td style="text-align: center; padding: 8px 0 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="width: 48px; height: 48px; background-color: #ecfdf5; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 22px;">&#9989;</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #059669;">Payment Received!</h2>
            <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.5;">
              <strong>${clientName}</strong> has paid invoice <strong style="font-family: monospace;">${invoiceNumber}</strong>.
            </p>
          </td>
        </tr>
      </table>
    `),
  });
}

export async function sendPaymentReminder(
  to: string,
  clientName: string,
  invoiceNumber: string,
  total: string,
  daysMessage: string,
  viewUrl: string
) {
  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: `Payment Reminder: Invoice ${invoiceNumber} - ${daysMessage}`,
    html: emailLayout("TradeInvoice", `
      <p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.5;">Hi ${clientName},</p>
      <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.5;">This is a friendly reminder about an outstanding invoice.</p>

      <!-- Reminder Card -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; margin: 0 0 28px;">
        <tr>
          <td style="padding: 20px 24px; border-left: 4px solid #f59e0b; border-radius: 10px 0 0 10px;">
            <p style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #92400e;">${daysMessage}</p>
            <p style="margin: 0 0 2px; font-size: 13px; color: #78716c;">Invoice: <strong style="font-family: monospace;">${invoiceNumber}</strong></p>
            <p style="margin: 8px 0 0; font-size: 26px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">${total}</p>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 0 12px;">
        <tr>
          <td style="text-align: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background-color: #0f172a; border-radius: 10px; text-align: center;">
                  <a href="${viewUrl}" style="display: inline-block; padding: 14px 36px; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none;">
                    View &amp; Pay Invoice
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `),
  });
}
