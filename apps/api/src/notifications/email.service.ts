import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmail(data: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false, // or 'STARTTLS'
      auth: {
        user: 'username',
        pass: 'password'
      }
    });

    const mailOptions = {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Notification',
      text: 'Notification sent successfully'
    };

    await transporter.sendMail(mailOptions);
  }
}