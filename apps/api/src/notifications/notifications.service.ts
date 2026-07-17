import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationChannel } from './notification-channel.enum';
import { Booking } from '../appointments/dto/create-appointment.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly queue: Queue<Booking>,
  ) {}

  async sendBookingConfirmation(notificationChannel: NotificationChannel, booking: Booking) {
    if (notificationChannel === NotificationChannel.Email) {
      // Send email using email service
      console.log('Sending booking confirmation email');
    } else if (notificationChannel === NotificationChannel.Push) {
      // Send push notification using push service
      console.log('Sending booking confirmation push notification');
    }
  }
}