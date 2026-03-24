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
  viewUrl: string
) {
  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: `Invoice ${invoiceNumber} from TradeInvoice`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e40af; font-size: 24px;">TradeInvoice</h1>
        <p style="font-size: 16px; color: #374151;">Hi ${clientName},</p>
        <p style="font-size: 16px; color: #374151;">You have a new invoice:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Invoice Number</p>
          <p style="margin: 4px 0 16px; font-size: 18px; font-weight: bold; color: #111827;">${invoiceNumber}</p>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">Amount Due</p>
          <p style="margin: 4px 0; font-size: 24px; font-weight: bold; color: #1e40af;">${total}</p>
        </div>
        <a href="${viewUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;">
          View Invoice
        </a>
        <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">Thank you for your business!</p>
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
