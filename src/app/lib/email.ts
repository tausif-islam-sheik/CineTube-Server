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
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f8f9fa; }
            .button { display: inline-block; background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${params.name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password.</p>
              <a href="${params.resetLink}" class="button">Reset Password</a>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                This link expires in 1 hour. If you didn't request this, please ignore this email.
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

  generatePaymentReceiptTemplate(params: PaymentReceiptParams): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f8f9fa; }
            .receipt { background-color: white; padding: 20px; border: 1px solid #ddd; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            table { width: 100%; margin-top: 20px; }
            th { text-align: left; border-bottom: 2px solid #007bff; padding: 10px 0; }
            td { padding: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Successful!</h1>
            </div>
            <div class="content">
              <p>Hi ${params.name},</p>
              <p>Thank you for your payment. Your subscription has been activated.</p>
              <div class="receipt">
                <h3>Receipt Details</h3>
                <table>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                  <tr>
                    <td>${params.subscriptionTier} Subscription</td>
                    <td>${params.currency} ${params.amount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>${params.currency} ${params.amount.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td>Transaction ID</td>
                    <td>${params.transactionId}</td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>${params.billingDate}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                You now have access to premium content. Enjoy streaming!
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
