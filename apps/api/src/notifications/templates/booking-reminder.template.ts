import { BookingNotificationData } from '../dto/send-notification.dto';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function getBookingReminderTemplate(data: BookingNotificationData): EmailTemplate {
  const { customerName, businessName, serviceName, appointmentDate, appointmentTime, businessAddress, businessPhone } = data;

  const subject = `Reminder: ${serviceName} at ${businessName} tomorrow`;

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
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .detail-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 16px; margin-top: 4px; }
    .cta { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⏰ Appointment Reminder</h1>
  </div>
  <div class="content">
    <p>Hi ${customerName},</p>
    <p>This is a friendly reminder about your upcoming appointment:</p>
    
    <div class="detail-row">
      <div class="label">Business</div>
      <div class="value">${businessName}</div>
    </div>
    
    <div class="detail-row">
      <div class="label">Service</div>
      <div class="value">${serviceName}</div>
    </div>
    
    <div class="detail-row">
      <div class="label">Date</div>
      <div class="value">${appointmentDate}</div>
    </div>
    
    <div class="detail-row">
      <div class="label">Time</div>
      <div class="value">${appointmentTime}</div>
    </div>
    
    ${businessAddress ? `
    <div class="detail-row">
      <div class="label">Address</div>
      <div class="value">${businessAddress}</div>
    </div>
    ` : ''}
    
    ${businessPhone ? `
    <div class="detail-row">
      <div class="label">Phone</div>
      <div class="value">${businessPhone}</div>
    </div>
    ` : ''}
    
    <p style="margin-top: 20px;">Please remember to arrive 5 minutes early. See you soon!</p>
  </div>
  <div class="footer">
    <p>Thank you for using Planity Clone!</p>
  </div>
</body>
</html>
`;

  const text = `
APPOINTMENT REMINDER

Hi ${customerName},

This is a friendly reminder about your upcoming appointment:

Business: ${businessName}
Service: ${serviceName}
Date: ${appointmentDate}
Time: ${appointmentTime}
${businessAddress ? `Address: ${businessAddress}\n` : ''}
${businessPhone ? `Phone: ${businessPhone}\n` : ''}

Please remember to arrive 5 minutes early. See you soon!

Thank you for using Planity Clone!
`;

  return { subject, html, text };
}
