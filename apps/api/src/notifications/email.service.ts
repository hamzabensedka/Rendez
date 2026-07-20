import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter(): void {
    const host = process.env.SMTP_HOST || 'smtp.resend.dev';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });

    this.logger.log(`Email service initialized with SMTP host: ${host}`);
  }

  private loadTemplates(): void {
    const templatesDir = path.join(__dirname, 'templates');
    const templateFiles = ['booking-confirmation', 'booking-reminder', 'booking-cancellation'];

    for (const templateName of templateFiles) {
      try {
        const templatePath = path.join(templatesDir, `${templateName}.hbs`);
        if (fs.existsSync(templatePath)) {
          const templateContent = fs.readFileSync(templatePath, 'utf-8');
          this.templates.set(templateName, Handlebars.compile(templateContent));
          this.logger.log(`Loaded template: ${templateName}`);
        }
      } catch (error) {
        this.logger.warn(`Failed to load template ${templateName}: ${error.message}`);
      }
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const template = this.templates.get(options.template);
      const html = template ? template(options.context) : JSON.stringify(options.context);

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Planity <noreply@planity.com>',
        to: options.to,
        subject: options.subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${options.to}, messageId: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
      return false;
    }
  }

  async sendBookingConfirmation(email: string, data: Record<string, any>): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Booking Confirmation - Your appointment is confirmed!',
      template: 'booking-confirmation',
      context: data,
    });
  }

  async sendBookingReminder(email: string, data: Record<string, any>): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Appointment Reminder - Your appointment is coming up!',
      template: 'booking-reminder',
      context: data,
    });
  }
}
