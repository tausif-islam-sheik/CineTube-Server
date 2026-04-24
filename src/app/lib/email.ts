import nodemailer from "nodemailer";
import { env } from "../config/env";

interface EmailTemplateParams {
  to: string;
  subject: string;
  html: string;
}

interface VerificationEmailParams {
  email: string;
  verificationLink: string;
  name: string;
}

interface PasswordResetEmailParams {
  email: string;
  resetLink: string;
  name: string;
}

interface PaymentReceiptParams {
  email: string;
  name: string;
  amount: number;
  currency: string;
  transactionId: string;
  subscriptionTier: string;
  billingDate: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Check if using SMTP or local testing
    if (env.SMTP_ENV === "production") {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT),
        secure: env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      // For development, use ethereal email (testing service)
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: env.ETHEREAL_USER || "test@ethereal.email",
          pass: env.ETHEREAL_PASS || "test-password",
        },
      });
    }
  }

  async sendEmail(params: EmailTemplateParams): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.error("Email transporter not initialized");
        return false;
      }

      const info = await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      console.log("Email sent:", info.response);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  generateVerificationEmailTemplate(params: VerificationEmailParams): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f8f9fa; }
            .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CineTube!</h1>
            </div>
            <div class="content">
              <p>Hi ${params.name},</p>
              <p>Thank you for registering with CineTube. Please verify your email address to activate your account.</p>
              <a href="${params.verificationLink}" class="button">Verify Email</a>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This link expires in 24 hours. If you didn't create this account, please ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2026 CineTube. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  generatePasswordResetTemplate(params: PasswordResetEmailParams): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - CineTube</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #f5f5f5;
              line-height: 1.6;
              color: #333;
            }
            
            .email-wrapper {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            }
            
            .header {
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              padding: 48px 40px;
              text-align: center;
            }
            
            .header h1 {
              color: #ffffff;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            .header .subtitle {
              color: #a0a0a0;
              font-size: 14px;
              margin-top: 8px;
              font-weight: 400;
            }
            
            .content {
              padding: 48px 40px;
              background: #ffffff;
            }
            
            .greeting {
              font-size: 18px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 16px;
            }
            
            .message {
              font-size: 15px;
              color: #555;
              line-height: 1.8;
              margin-bottom: 32px;
            }
            
            .button-container {
              text-align: center;
              margin: 32px 0;
            }
            
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
              color: #ffffff !important;
              font-size: 16px;
              font-weight: 600;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 8px;
              box-shadow: 0 4px 16px rgba(229, 9, 20, 0.3);
              transition: all 0.3s ease;
            }
            
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
            }
            
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
              margin: 32px 0;
            }
            
            .security-notice {
              background: #f8f9fa;
              border-left: 4px solid #e50914;
              padding: 20px 24px;
              border-radius: 0 8px 8px 0;
              margin-top: 24px;
            }
            
            .security-notice h4 {
              font-size: 14px;
              font-weight: 600;
              color: #1a1a2e;
              margin-bottom: 8px;
            }
            
            .security-notice p {
              font-size: 13px;
              color: #666;
              margin: 0;
            }
            
            .expiry-warning {
              text-align: center;
              font-size: 13px;
              color: #888;
              margin-top: 24px;
              padding: 16px;
              background: #fafafa;
              border-radius: 6px;
            }
            
            .footer {
              background: #1a1a2e;
              padding: 32px 40px;
              text-align: center;
            }
            
            .footer-brand {
              color: #ffffff;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .footer-copy {
              color: #888;
              font-size: 12px;
            }
            
            .social-links {
              margin-top: 20px;
            }
            
            .social-links a {
              display: inline-block;
              margin: 0 12px;
              color: #888;
              text-decoration: none;
              font-size: 12px;
            }
            
            @media (max-width: 600px) {
              .email-wrapper { margin: 0; border-radius: 0; }
              .header, .content, .footer { padding: 32px 24px; }
              .header h1 { font-size: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>Password Reset</h1>
              <p class="subtitle">CineTube Security</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hi ${params.name},</p>
              <p class="message">
                We received a request to reset the password for your CineTube account. 
                To proceed, please click the button below. This secure link will take you 
                to our password reset page where you can create a new password.
              </p>
              
              <div class="button-container">
                <a href="${params.resetLink}" class="button">Reset My Password</a>
              </div>
              
              <div class="divider"></div>
              
              <p class="expiry-warning">
                <strong>⏱ This link expires in 1 hour</strong><br>
                For security reasons, this password reset link will expire shortly. 
                If you need a new link, please visit the login page and request another reset.
              </p>
              
              <div class="security-notice">
                <h4>🔒 Didn't request this reset?</h4>
                <p>
                  If you didn't make this request, your account is still secure. 
                  No changes have been made to your password. You can safely ignore this email.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-brand">CineTube</p>
              <p class="footer-copy">© 2026 CineTube. All rights reserved.</p>
              <div class="social-links">
                <a href="#">Support</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  generatePaymentReceiptTemplate(params: PaymentReceiptParams): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt - CineTube</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
              line-height: 1.6;
              color: #e0e0e0;
              min-height: 100vh;
            }
            
            .email-wrapper {
              max-width: 600px;
              margin: 40px auto;
              background: linear-gradient(180deg, #1e1e2e 0%, #252538 100%);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
              border: 1px solid rgba(229, 9, 20, 0.2);
            }
            
            .header {
              background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
              padding: 40px;
              text-align: center;
              position: relative;
            }
            
            .header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            }
            
            .header-icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
            
            .header h1 {
              color: #ffffff;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            .header .subtitle {
              color: rgba(255, 255, 255, 0.9);
              font-size: 14px;
              margin-top: 8px;
              font-weight: 500;
            }
            
            .content {
              padding: 40px;
            }
            
            .greeting {
              font-size: 18px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 12px;
            }
            
            .message {
              font-size: 15px;
              color: #a0a0b0;
              line-height: 1.8;
              margin-bottom: 28px;
            }
            
            .receipt-box {
              background: linear-gradient(180deg, #2a2a3e 0%, #32324a 100%);
              border-radius: 12px;
              padding: 28px;
              margin-bottom: 24px;
              border: 1px solid rgba(229, 9, 20, 0.15);
            }
            
            .receipt-title {
              font-size: 18px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .receipt-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
            
            .receipt-row:last-child {
              border-bottom: none;
            }
            
            .receipt-row.total {
              background: rgba(229, 9, 20, 0.1);
              margin: 0 -12px;
              padding: 16px 12px;
              border-radius: 8px;
              border: 1px solid rgba(229, 9, 20, 0.2);
            }
            
            .receipt-label {
              font-size: 14px;
              color: #a0a0b0;
              font-weight: 500;
            }
            
            .receipt-value {
              font-size: 14px;
              color: #ffffff;
              font-weight: 500;
              text-align: right;
            }
            
            .receipt-row.total .receipt-label,
            .receipt-row.total .receipt-value {
              font-size: 16px;
              font-weight: 700;
              color: #ffffff;
            }
            
            .amount-highlight {
              color: #4ade80;
              font-weight: 700;
            }
            
            .transaction-id {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #808090;
              word-break: break-all;
              background: rgba(0, 0, 0, 0.3);
              padding: 8px 12px;
              border-radius: 6px;
              margin-top: 4px;
            }
            
            .benefits {
              background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(229, 9, 20, 0.05) 100%);
              border: 1px solid rgba(229, 9, 20, 0.2);
              border-radius: 10px;
              padding: 20px;
              margin-top: 24px;
            }
            
            .benefits-title {
              font-size: 14px;
              font-weight: 600;
              color: #e50914;
              margin-bottom: 12px;
            }
            
            .benefits-list {
              list-style: none;
              font-size: 14px;
              color: #c0c0d0;
            }
            
            .benefits-list li {
              padding: 4px 0;
              padding-left: 20px;
              position: relative;
            }
            
            .benefits-list li::before {
              content: '✓';
              position: absolute;
              left: 0;
              color: #4ade80;
              font-weight: 700;
            }
            
            .footer {
              background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
              padding: 32px 40px;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .footer-brand {
              font-size: 20px;
              font-weight: 700;
              color: #e50914;
              margin-bottom: 8px;
              letter-spacing: -0.5px;
            }
            
            .footer-copy {
              font-size: 12px;
              color: #606070;
              margin-bottom: 16px;
            }
            
            .social-links {
              display: flex;
              justify-content: center;
              gap: 20px;
            }
            
            .social-links a {
              color: #808090;
              text-decoration: none;
              font-size: 12px;
              transition: color 0.2s;
            }
            
            .social-links a:hover {
              color: #e50914;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="header-icon">🎬</div>
              <h1>Payment Successful!</h1>
              <p class="subtitle">Welcome to Premium Streaming</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hi ${params.name},</p>
              <p class="message">Thank you for your payment! Your ${params.subscriptionTier} subscription has been activated. Get ready to enjoy unlimited premium content.</p>
              
              <div class="receipt-box">
                <div class="receipt-title">📄 Receipt Details</div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Plan</span>
                  <span class="receipt-value">${params.subscriptionTier}</span>
                </div>
                
                <div class="receipt-row">
                  <span class="receipt-label">Billing Period</span>
                  <span class="receipt-value">${params.billingDate}</span>
                </div>
                
                <div class="receipt-row total">
                  <span class="receipt-label">Total Paid</span>
                  <span class="receipt-value amount-highlight">${params.currency} ${params.amount.toFixed(2)}</span>
                </div>
                
                <div class="receipt-row" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <span class="receipt-label">Transaction ID</span>
                  <span class="receipt-value">
                    <div class="transaction-id">${params.transactionId}</div>
                  </span>
                </div>
              </div>
              
              <div class="benefits">
                <div class="benefits-title">✨ Your Premium Benefits</div>
                <ul class="benefits-list">
                  <li>Ad-free streaming experience</li>
                  <li>HD & 4K quality content</li>
                  <li>Download for offline viewing</li>
                  <li>Multiple device access</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-brand">CineTube</p>
              <p class="footer-copy">© 2026 CineTube. All rights reserved.</p>
              <div class="social-links">
                <a href="#">Support</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendVerificationEmail(params: VerificationEmailParams): Promise<boolean> {
    const html = this.generateVerificationEmailTemplate(params);
    return this.sendEmail({
      to: params.email,
      subject: "Verify Your CineTube Email",
      html,
    });
  }

  async sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<boolean> {
    const html = this.generatePasswordResetTemplate(params);
    return this.sendEmail({
      to: params.email,
      subject: "Reset Your CineTube Password",
      html,
    });
  }

  async sendPaymentReceipt(params: PaymentReceiptParams): Promise<boolean> {
    const html = this.generatePaymentReceiptTemplate(params);
    return this.sendEmail({
      to: params.email,
      subject: "Payment Receipt - CineTube",
      html,
    });
  }
}

export const emailService = new EmailService();
