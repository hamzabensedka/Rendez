import { BookingNotificationData } from '../notification-channel.enum';
import { EmailTemplate, PushTemplate } from './booking-confirmation.template';

export function getBookingReminderEmailTemplate(data: BookingNotificationData): EmailTemplate {
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
    subject: `Reminder: ${data.serviceName} at ${data.businessName} Tomorrow`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
            .label { font-weight: bold; color: #6b7280; }
            .footer { text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Reminder 🔔</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>This is a friendly reminder about your upcoming appointment:</p>
              
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
              
              <p>Please remember to:</p>
              <ul>
                <li>Arrive 5-10 minutes early</li>
                <li>Bring any required items</li>
              </ul>
              <p>We look forward to seeing you!</p>
            </div>
            <div class="footer">
              <p>Thank you for using Planity!</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Appointment Reminder

Hi ${data.customerName},

This is a friendly reminder about your upcoming appointment:

Business: ${data.businessName}
Service: ${data.serviceName}
Date: ${formattedDate}
Time: ${formattedTime}

Please remember to:
- Arrive 5-10 minutes early
- Bring any required items

We look forward to seeing you!

Thank you for using Planity!
    `,
  };
}

export function getBookingReminderPushTemplate(data: BookingNotificationData): PushTemplate {
  const tomorrow = new Date(data.dateTime);
  const isTomorrow = tomorrow.getDate() === new Date(Date.now() + 86400000).getDate();
  const timeString = new Date(data.dateTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    title: 'Appointment Reminder 🔔',
    body: isTomorrow
      ? `Your ${data.serviceName} appointment is tomorrow at ${timeString}`
      : `Your ${data.serviceName} appointment is coming up at ${timeString}`,
  };
}
