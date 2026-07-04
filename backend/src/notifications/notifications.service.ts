import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseMessagingService } from './firebase-messaging.service';
import { EmailService } from './email.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FirebaseMessagingService,
    private readonly emailService: EmailService,
  ) {}

  async sendBookingConfirmation(bookingId: string): Promise<void> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          client: true,
          business: true,
          service: true,
        },
      });

      if (!booking) {
        this.logger.warn(`Booking not found: ${bookingId}`);
        return;
      }

      const title = 'Booking Confirmed!';
      const body = `Your appointment at ${booking.business.name} for ${booking.service.name} on ${booking.date.toLocaleString()} is confirmed.`;

      // Send push notification
      if (booking.client.fcmToken) {
        await this.fcmService.sendNotification(booking.client.fcmToken, {
          title,
          body,
          data: {
            type: 'BOOKING_CONFIRMATION',
            bookingId: booking.id,
          },
        });
      }

      // Send email
      await this.emailService.sendBookingConfirmation(booking);

      // Log notification
      await this.prisma.notification.create({
        data: {
          userId: booking.clientId,
          title,
          body,
          type: 'BOOKING_CONFIRMATION',
          read: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send booking confirmation for ${bookingId}: ${error.message}`,
        error.stack,
      );
    }
  }

  async sendBookingReminder(bookingId: string, reminderType: '24h' | '1h'): Promise<void> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          client: true,
          business: true,
          service: true,
        },
      });

      if (!booking) {
        this.logger.warn(`Booking not found: ${bookingId}`);
        return;
      }

      const title = 'Appointment Reminder';
      const body = `Reminder: Your appointment at ${booking.business.name} for ${booking.service.name} is scheduled for ${booking.date.toLocaleString()}.`;

      // Send push notification
      if (booking.client.fcmToken) {
        await this.fcmService.sendNotification(booking.client.fcmToken, {
          title,
          body,
          data: {
            type: 'BOOKING_REMINDER',
            bookingId: booking.id,
          },
        });
      }

      // Send email
      await this.emailService.sendBookingReminder(booking, reminderType);

      // Log notification
      await this.prisma.notification.create({
        data: {
          userId: booking.clientId,
          title,
          body,
          type: 'BOOKING_REMINDER',
          read: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send booking reminder (${reminderType}) for ${bookingId}: ${error.message}`,
        error.stack,
      );
    }
  }

  async sendBookingCancellation(bookingId: string): Promise<void> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          client: true,
          business: true,
          service: true,
        },
      });

      if (!booking || booking.status !== BookingStatus.CANCELLED) {
        this.logger.warn(`Invalid booking cancellation request for: ${bookingId}`);
        return;
      }

      const title = 'Booking Cancelled';
      const body = `Your appointment at ${booking.business.name} for ${booking.service.name} on ${booking.date.toLocaleString()} has been cancelled.`;

      // Send push notification
      if (booking.client.fcmToken) {
        await this.fcmService.sendNotification(booking.client.fcmToken, {
          title,
          body,
          data: {
            type: 'BOOKING_CANCELLATION',
            bookingId: booking.id,
          },
        });
      }

      // Send email
      await this.emailService.sendBookingCancellation(booking);

      // Log notification
      await this.prisma.notification.create({
        data: {
          userId: booking.clientId,
          title,
          body,
          type: 'BOOKING_CANCELLATION',
          read: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send booking cancellation for ${bookingId}: ${error.message}`,
        error.stack,
      );
    }
  }

  async sendReviewRequest(bookingId: string): Promise<void> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          client: true,
          business: true,
          service: true,
        },
      });

      if (!booking || booking.status !== BookingStatus.COMPLETED) {
        this.logger.warn(`Invalid review request for booking: ${bookingId}`);
        return;
      }

      const title = 'Leave a Review';
      const body = `How was your experience at ${booking.business.name}? We'd love to hear your feedback!`;

      // Send push notification
      if (booking.client.fcmToken) {
        await this.fcmService.sendNotification(booking.client.fcmToken, {
          title,
          body,
          data: {
            type: 'REVIEW_REQUEST',
            bookingId: booking.id,
          },
        });
      }

      // Send email
      await this.emailService.sendReviewRequest(booking);

      // Log notification
      await this.prisma.notification.create({
        data: {
          userId: booking.clientId,
          title,
          body,
          type: 'REVIEW_REQUEST',
          read: false,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send review request for ${bookingId}: ${error.message}`,
        error.stack,
      );
    }
  }
}