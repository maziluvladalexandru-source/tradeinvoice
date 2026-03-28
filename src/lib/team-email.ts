import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromEmail() {
  return process.env.FROM_EMAIL || "TradeInvoice <noreply@tradeinvoice.app>";
}

export async function sendTeamInviteEmail(to: string, businessName: string, acceptUrl: string) {
  await getResend().emails.send({
    from: getFromEmail(),
    to,
    subject: `You've been invited to join ${businessName} on TradeInvoice`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #0c0a09;">
    <tr>
      <td style="padding: 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; width: 100%;">
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #1c1917; border-radius: 16px; overflow: hidden; border: 1px solid #292524;">
                <tr>
                  <td style="padding: 36px 36px 32px;">
                    <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #ffffff;">Team Invitation</p>
                    <p style="margin: 0 0 24px; font-size: 16px; color: #a8a29e; line-height: 1.5;">
                      <strong style="color: #ffffff;">${businessName}</strong> has invited you to join their team on TradeInvoice.
                    </p>
                    <p style="margin: 0 0 24px; font-size: 14px; color: #78716c; line-height: 1.5;">
                      As a team member, you can create invoices, view clients, and log time and expenses.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #f59e0b; border-radius: 12px; text-align: center;">
                          <a href="${acceptUrl}" style="display: inline-block; padding: 14px 36px; color: #0c0a09; font-size: 16px; font-weight: 700; text-decoration: none;">
                            Accept Invitation
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 0 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #57534e;">
                Sent via <a href="https://tradeinvoice.app" style="color: #f59e0b; font-weight: 600; text-decoration: none;">TradeInvoice</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
