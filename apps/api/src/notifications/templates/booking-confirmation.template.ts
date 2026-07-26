import { BookingNotificationData } from '../notification-channel.enum';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface PushTemplate {
  title: string;
  body: string;
}

export function getBookingConfirmationEmailTemplate(data: BookingNotificationData): EmailTemplate {
  const formattedDate = new Date(data.dateTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(data.dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    subject: `Booking Confirmed: ${data.serviceName} at ${data.businessName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
            .label { font-weight: bold; color: #6b7280; }
            .footer { text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed ✓</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Your appointment has been successfully booked. Here are the details:</p>
              
              <div class="detail-row">
                <span class="label">Business:</span> ${data.businessName}
              </div>
              <div class="detail-row">
                <span class="label">Service:</span> ${data.serviceName}
              </div>
              <div class="detail-row">
                <span class="label">Date:</span> ${formattedDate}
              </div>
              <div class="detail-row">
                <span class="label">Time:</span> ${formattedTime}
              </div>
              <div class="detail-row">
                <span class="label">Confirmation ID:</span> ${data.appointmentId}
              </div>
              
              <p>Please arrive 5-10 minutes before your scheduled time.</p>
              <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
            </div>
            <div class="footer">
              <p>Thank you for using Planity!</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Booking Confirmed

Hi ${data.customerName},

Your appointment has been successfully booked:

Business: ${data.businessName}
Service: ${data.serviceName}
Date: ${formattedDate}
Time: ${formattedTime}
Confirmation ID: ${data.appointmentId}

Please arrive 5-10 minutes before your scheduled time.
If you need to reschedule or cancel, please do so at least 24 hours in advance.

Thank you for using Planity!
    `,
  };
}

export function getBookingConfirmationPushTemplate(data: BookingNotificationData): PushTemplate {
  return {
    title: 'Booking Confirmed ✓',
    body: `${data.serviceName} at ${data.businessName} on ${new Date(data.dateTime).toLocaleDateString()}`,
  };
}
