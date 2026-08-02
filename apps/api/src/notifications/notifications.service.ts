import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly mailerService: MailerService
  ) {}

  async sendBookingConfirmationEmail(bookingDetails: any) {
    const transport = createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false, // or 'STARTTLS'
      auth: {
        user: 'user',
        pass: 'pass'
      }
    });

    const message = {
      from: 'info@example.com',
      to: bookingDetails.userEmail,
      subject: 'Booking Confirmation',
      text: `Your booking with ${bookingDetails.businessName} has been confirmed.`
    };

    await transport.sendMail(message);
  }
}
