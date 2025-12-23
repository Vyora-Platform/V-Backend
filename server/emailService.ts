import nodemailer from 'nodemailer';

// SendGrid SMTP Configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 2525,
  secure: false, // Use STARTTLS
  auth: {
    // user: 'apikey',
    // pass: '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',
    user:process.env.SENDGRID_API_USER!,
    pass:process.env.SENDGRID_API_KEY!
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ [Email] SMTP connection error:', error);
  } else {
    console.log('✅ [Email] SMTP server is ready to send emails');
  }
});

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP email for password reset
 */
export async function sendPasswordResetOTP(email: string, otp: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: {
        name: 'Vyora-Software',
        address: 'no-reply@kamaify.com',
      },
      to: email,
      subject: 'Password Reset OTP - Vyora',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🔐 Password Reset</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Hello,<br><br>
                You requested to reset your password for your Vyora account. Use the OTP below to proceed:
              </p>
              
              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border: 2px dashed #3b82f6; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Your OTP Code</p>
                <div style="font-size: 40px; font-weight: 700; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  ⏰ <strong>This OTP expires in 10 minutes.</strong><br>
                  If you didn't request this, please ignore this email or contact support.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
                For security, never share this OTP with anyone.<br><br>
                Best regards,<br>
                <strong style="color: #374151;">The Vyora Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Vyora. All rights reserved.<br>
                <a href="#" style="color: #3b82f6; text-decoration: none;">Privacy Policy</a> • 
                <a href="#" style="color: #3b82f6; text-decoration: none;">Terms of Service</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      text: `
Password Reset OTP - Vyora

Hello,

You requested to reset your password for your Vyora account.

Your OTP Code: ${otp}

This OTP expires in 10 minutes.

If you didn't request this, please ignore this email or contact support.

For security, never share this OTP with anyone.

Best regards,
The Vyora Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Email] Password reset OTP sent to ${email}, Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ [Email] Failed to send password reset OTP:', error);
    return false;
  }
}

