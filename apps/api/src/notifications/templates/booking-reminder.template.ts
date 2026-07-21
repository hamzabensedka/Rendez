import { BookingNotificationData } from '../interfaces/notification.interface';

export function getBookingReminderEmailTemplate(data: BookingNotificationData): { subject: string; html: string; text: string } {
  const subject = `Reminder - Your appointment tomorrow at ${data.businessName}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Reminder</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: bold; color: #6b7280; }
    .detail-value { color: #111827; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
    .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⏰ Appointment Reminder</h1>
  </div>
  <div class="content">
    <p>Hi ${data.userName},</p>
    <p>This is a friendly reminder about your upcoming appointment:</p>
    
    <div class="detail-row">
      <span class="detail-label">Business:</span>
      <span class="detail-value">${data.businessName}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Service:</span>
      <span class="detail-value">${data.serviceName}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Date:</span>
      <span class="detail-value">${data.appointmentDate}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Time:</span>
      <span class="detail-value">${data.appointmentTime}</span>
    </div>
    ${data.businessAddress ? `
    <div class="detail-row">
      <span class="detail-label">Address:</span>
      <span class="detail-value">${data.businessAddress}</span>
    </div>
    ` : ''}
    ${data.businessPhone ? `
    <div class="detail-row">
      <span class="detail-label">Phone:</span>
      <span class="detail-value">${data.businessPhone}</span>
    </div>
    ` : ''}
    
    <p style="margin-top: 20px;">Please remember to arrive 5 minutes early. If you need to make any changes, please contact the business directly.</p>
    
    <p>See you soon!</p>
  </div>
  <div class="footer">
    <p>This is an automated message from Planity Clone. Please do not reply to this email.</p>
  </div>
</body>
</html>`;

  const text = `
APPOINTMENT REMINDER

Hi ${data.userName},

This is a friendly reminder about your upcoming appointment:

Business: ${data.businessName}
Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
${data.businessAddress ? `Address: ${data.businessAddress}
` : ''}
${data.businessPhone ? `Phone: ${data.businessPhone}
` : ''}

Please remember to arrive 5 minutes early. If you need to make any changes, please contact the business directly.

See you soon!
`;

  return { subject, html, text };
}
