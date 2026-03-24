import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromEmail() {
  return process.env.FROM_EMAIL || "TradeInvoice <noreply@tradeinvoice.com>";
}

export async function sendMagicLink(email: string, url: string) {
  await getResend().emails.send({
    from: getFromEmail(),
    to: email,
    subject: "Sign in to TradeInvoice",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e40af; font-size: 24px;">TradeInvoice</h1>
        <p style="font-size: 16px; color: #374151;">Click the button below to sign in:</p>
        <a href="${url}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; margin: 16px 0;">
          Sign In
        </a>
        <p style="font-size: 14px; color: #6b7280;">This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
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
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
          <h1 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700;">${from}</h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.5;">Hi ${clientName},</p>
          <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.5;">You have received a new invoice. Here are the details:</p>

          <!-- Invoice Card -->
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 0 0 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 0 0 16px;">
                  <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Invoice</p>
                  <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #111827; font-family: monospace;">${invoiceNumber}</p>
                </td>
                ${dueDate ? `<td style="padding: 0 0 16px; text-align: right;">
                  <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Due Date</p>
                  <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #111827;">${dueDate}</p>
                </td>` : ""}
              </tr>
              <tr>
                <td colspan="2" style="padding: 16px 0 0; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; font-weight: 600;">Amount Due</p>
                  <p style="margin: 6px 0 0; font-size: 32px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">${total}</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 0 0 28px;">
            <a href="${viewUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: 0.01em;">
              View &amp; Pay Invoice
            </a>
          </div>

          <p style="margin: 0; font-size: 14px; color: #9ca3af; text-align: center;">
            Or copy this link: <a href="${viewUrl}" style="color: #6b7280; word-break: break-all;">${viewUrl}</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; font-size: 13px; color: #9ca3af;">
            Sent via <a href="https://tradeinvoice.com" style="color: #9ca3af; font-weight: 600; text-decoration: none;">TradeInvoice</a>
          </p>
        </div>
      </div>
    `,
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
    subject: `Invoice ${invoiceNumber} was viewed`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e40af; font-size: 24px;">TradeInvoice</h1>
        <p style="font-size: 16px; color: #374151;">Your invoice ${invoiceNumber} to ${clientName} was viewed just now.</p>
      </div>
    `,
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
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e40af; font-size: 24px;">TradeInvoice</h1>
        <p style="font-size: 16px; color: #374151;">Great news! Invoice ${invoiceNumber} from ${clientName} has been paid.</p>
      </div>
    `,
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
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e40af; font-size: 24px;">TradeInvoice</h1>
        <p style="font-size: 16px; color: #374151;">Hi ${clientName},</p>
        <p style="font-size: 16px; color: #374151;">This is a friendly reminder about your invoice:</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">${daysMessage}</p>
          <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Invoice: ${invoiceNumber}</p>
          <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold; color: #111827;">${total}</p>
        </div>
        <a href="${viewUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
          View & Pay Invoice
        </a>
      </div>
    `,
  });
}
