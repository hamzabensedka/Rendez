import { BookingNotificationData } from '../dto/send-notification.dto';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function getBookingConfirmationTemplate(data: BookingNotificationData): EmailTemplate {
  const { customerName, businessName, serviceName, appointmentDate, appointmentTime, businessAddress, businessPhone } = data;

  const subject = `Booking Confirmed: ${serviceName} at ${businessName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .detail-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 16px; margin-top: 4px; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Booking Confirmed ✓</h1>
  </div>
  <div class="content">
    <p>Hi ${customerName},</p>
    <p>Your appointment has been successfully booked. Here are the details:</p>
    
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
    
    <p style="margin-top: 20px;">Please arrive 5 minutes before your scheduled time. If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
  </div>
  <div class="footer">
    <p>Thank you for using Planity Clone!</p>
  </div>
</body>
</html>
`;

  const text = `
BOOKING CONFIRMED

Hi ${customerName},

Your appointment has been successfully booked. Here are the details:

Business: ${businessName}
Service: ${serviceName}
Date: ${appointmentDate}
Time: ${appointmentTime}
${businessAddress ? `Address: ${businessAddress}\n` : ''}
${businessPhone ? `Phone: ${businessPhone}\n` : ''}

Please arrive 5 minutes before your scheduled time.
If you need to reschedule or cancel, please do so at least 24 hours in advance.

Thank you for using Planity Clone!
`;

  return { subject, html, text };
}
