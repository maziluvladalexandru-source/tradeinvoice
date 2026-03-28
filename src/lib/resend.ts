import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromEmail() {
  return process.env.FROM_EMAIL || "TradeInvoice <noreply@tradeinvoice.app>";
}

/** Professional email layout with dark/amber branding */
function emailLayout(businessName: string, content: string, accentColor?: string) {
  const accent = accentColor || "#f59e0b";
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #0c0a09;">
    <tr>
      <td style="padding: 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; width: 100%;">
          <!-- Header with logo area -->
          <tr>
            <td style="padding: 0 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 44px; height: 44px; background-color: ${accent}; border-radius: 12px; text-align: center; vertical-align: middle; font-size: 20px; font-weight: 800; color: #0c0a09;">
                          ${businessName.charAt(0).toUpperCase()}
                        </td>
                        <td style="padding-left: 14px;">
                          <p style="margin: 0; font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.01em;">${businessName}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #1c1917; border-radius: 16px; overflow: hidden; border: 1px solid #292524;">
                <tr>
                  <td style="padding: 36px 36px 32px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 28px 0 0; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #57534e;">
                Sent via <a href="https://tradeinvoice.app" style="color: ${accent}; font-weight: 600; text-decoration: none;">TradeInvoice</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #44403c;">
                Professional invoicing for freelancers &amp; small businesses
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
      <p style="margin: 0 0 20px; font-size: 16px; color: #d6d3d1; line-height: 1.5;">Click the button below to sign in:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 20px;">
        <tr>
          <td style="background-color: #f59e0b; border-radius: 10px; text-align: center;">
            <a href="${url}" style="display: inline-block; padding: 14px 32px; color: #0c0a09; font-size: 16px; font-weight: 700; text-decoration: none;">
              Sign In
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0; font-size: 13px; color: #78716c;">This link expires in 15 minutes. If you didn&rsquo;t request this, you can safely ignore this email.</p>
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
      <p style="margin: 0 0 8px; font-size: 16px; color: #d6d3d1; line-height: 1.5;">Hi ${clientName},</p>
      <p style="margin: 0 0 28px; font-size: 16px; color: #a8a29e; line-height: 1.5;">
        You have received a new invoice from <strong style="color: #ffffff;">${from}</strong>.
      </p>

      <!-- Amount Highlight -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #292524; border-radius: 12px; margin: 0 0 20px; border: 1px solid #3f3f46;">
        <tr>
          <td style="padding: 28px 24px; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #78716c; font-weight: 600;">Amount Due</p>
            <p style="margin: 0; font-size: 38px; font-weight: 800; color: #f59e0b; letter-spacing: -0.02em;">${total}</p>
          </td>
        </tr>
      </table>

      <!-- Invoice Details -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 0 28px;">
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #292524;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="font-size: 13px; color: #78716c; font-weight: 500;">Invoice Number</td>
                <td style="text-align: right; font-size: 14px; font-weight: 700; color: #ffffff; font-family: 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;">${invoiceNumber}</td>
              </tr>
            </table>
          </td>
        </tr>
        ${dueDate ? `<tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #292524;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="font-size: 13px; color: #78716c; font-weight: 500;">Due Date</td>
                <td style="text-align: right; font-size: 14px; font-weight: 700; color: #fbbf24;">${dueDate}</td>
              </tr>
            </table>
          </td>
        </tr>` : ""}
        <tr>
          <td style="padding: 14px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="font-size: 13px; color: #78716c; font-weight: 500;">From</td>
                <td style="text-align: right; font-size: 14px; font-weight: 600; color: #d6d3d1;">${from}</td>
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
                <td style="background-color: #f59e0b; border-radius: 12px; text-align: center;">
                  <a href="${viewUrl}" style="display: inline-block; padding: 16px 48px; color: #0c0a09; font-size: 16px; font-weight: 800; text-decoration: none; letter-spacing: 0.01em;">
                    View &amp; Pay Invoice
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0; font-size: 12px; color: #57534e; text-align: center; line-height: 1.5;">
        Or copy this link:<br>
        <a href="${viewUrl}" style="color: #78716c; word-break: break-all; font-size: 11px;">${viewUrl}</a>
      </p>
    `),
  });
}

export async function sendOverdueInvoiceEmail(
  to: string,
  clientName: string,
  invoiceNumber: string,
  total: string,
  dueDate: string,
  daysOverdue: number,
  viewUrl: string,
  businessName?: string
) {
  const from = businessName || "TradeInvoice";
  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: `OVERDUE: Invoice ${invoiceNumber} — ${total} was due ${dueDate}`,
    html: emailLayout(from, `
      <!-- Urgent Banner -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #451a03; border-radius: 10px; margin: 0 0 24px; border: 1px solid #92400e;">
        <tr>
          <td style="padding: 16px 20px; text-align: center;">
            <p style="margin: 0; font-size: 13px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.08em;">
              Payment Overdue — ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} past due
            </p>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 8px; font-size: 16px; color: #d6d3d1; line-height: 1.5;">Hi ${clientName},</p>
      <p style="margin: 0 0 24px; font-size: 16px; color: #a8a29e; line-height: 1.5;">
        This is an urgent reminder that payment for the following invoice is now <strong style="color: #ef4444;">overdue</strong>. Please arrange payment at your earliest convenience to avoid any disruption.
      </p>

      <!-- Amount Highlight -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #292524; border-radius: 12px; margin: 0 0 20px; border: 1px solid #dc2626;">
        <tr>
          <td style="padding: 28px 24px; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #ef4444; font-weight: 600;">Overdue Amount</p>
            <p style="margin: 0; font-size: 38px; font-weight: 800; color: #ef4444; letter-spacing: -0.02em;">${total}</p>
          </td>
        </tr>
      </table>

      <!-- Invoice Details -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 0 28px;">
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #292524;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="font-size: 13px; color: #78716c; font-weight: 500;">Invoice Number</td>
                <td style="text-align: right; font-size: 14px; font-weight: 700; color: #ffffff; font-family: 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;">${invoiceNumber}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #292524;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="font-size: 13px; color: #78716c; font-weight: 500;">Due Date</td>
                <td style="text-align: right; font-size: 14px; font-weight: 700; color: #ef4444;">${dueDate} (${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} ago)</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td style="font-size: 13px; color: #78716c; font-weight: 500;">From</td>
                <td style="text-align: right; font-size: 14px; font-weight: 600; color: #d6d3d1;">${from}</td>
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
                <td style="background-color: #ef4444; border-radius: 12px; text-align: center;">
                  <a href="${viewUrl}" style="display: inline-block; padding: 16px 48px; color: #ffffff; font-size: 16px; font-weight: 800; text-decoration: none; letter-spacing: 0.01em;">
                    Pay Now
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin: 0; font-size: 13px; color: #78716c; text-align: center; line-height: 1.6;">
        If you&rsquo;ve already sent payment, please disregard this reminder.<br>
        For questions, reply directly to this email.
      </p>
    `, "#ef4444"),
  });
}

export async function sendInvoiceViewedNotification(
  contractorEmail: string,
  invoiceNumber: string,
  clientName: string,
  dashboardUrl?: string
) {
  const dashUrl = dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || "https://tradeinvoice.app"}/dashboard`;
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
                <td style="width: 48px; height: 48px; background-color: #1e3a5f; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 22px;">&#128065;</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #ffffff;">Invoice Viewed</h2>
            <p style="margin: 0 0 4px; font-size: 15px; color: #d6d3d1; line-height: 1.5;">
              <strong style="color: #ffffff;">${clientName}</strong> has viewed invoice <strong style="font-family: monospace; color: #f59e0b;">${invoiceNumber}</strong>.
            </p>
            <p style="margin: 0 0 20px; font-size: 13px; color: #78716c;">Just now</p>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background-color: #f59e0b; border-radius: 10px; text-align: center;">
                  <a href="${dashUrl}" style="display: inline-block; padding: 12px 28px; color: #0c0a09; font-size: 14px; font-weight: 700; text-decoration: none;">
                    View Dashboard
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
                <td style="width: 48px; height: 48px; background-color: #052e16; border-radius: 50%; text-align: center; vertical-align: middle;">
                  <span style="font-size: 22px;">&#9989;</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">
            <h2 style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #4ade80;">Payment Received!</h2>
            <p style="margin: 0; font-size: 15px; color: #d6d3d1; line-height: 1.5;">
              <strong style="color: #ffffff;">${clientName}</strong> has paid invoice <strong style="font-family: monospace; color: #f59e0b;">${invoiceNumber}</strong>.
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
      <p style="margin: 0 0 20px; font-size: 16px; color: #d6d3d1; line-height: 1.5;">Hi ${clientName},</p>
      <p style="margin: 0 0 24px; font-size: 16px; color: #a8a29e; line-height: 1.5;">This is a friendly reminder about an outstanding invoice.</p>

      <!-- Reminder Card -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #292524; border-radius: 12px; margin: 0 0 28px; border: 1px solid #f59e0b;">
        <tr>
          <td style="padding: 20px 24px; border-left: 4px solid #f59e0b; border-radius: 12px;">
            <p style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #fbbf24;">${daysMessage}</p>
            <p style="margin: 0 0 2px; font-size: 13px; color: #78716c;">Invoice: <strong style="font-family: monospace; color: #d6d3d1;">${invoiceNumber}</strong></p>
            <p style="margin: 8px 0 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">${total}</p>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 0 12px;">
        <tr>
          <td style="text-align: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="background-color: #f59e0b; border-radius: 12px; text-align: center;">
                  <a href="${viewUrl}" style="display: inline-block; padding: 14px 36px; color: #0c0a09; font-size: 16px; font-weight: 700; text-decoration: none;">
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
