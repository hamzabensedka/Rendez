import { BookingNotificationData } from '../interfaces/notification.interface';

export function getBookingCancellationEmailTemplate(data: BookingNotificationData): { subject: string; html: string; text: string } {
  const subject = `Booking Cancelled - ${data.businessName}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancellation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-label { font-weight: bold; color: #6b7280; }
    .detail-value { color: #111827; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Booking Cancelled</h1>
  </div>
  <div class="content">
    <p>Hi ${data.userName},</p>
    <p>Your appointment has been cancelled. Here are the details:</p>
    
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
    
    <p style="margin-top: 20px;">We're sorry to see you go. If you'd like to rebook, please visit our app.</p>
    
    <p>Thank you for using Planity Clone!</p>
  </div>
  <div class="footer">
    <p>This is an automated message from Planity Clone. Please do not reply to this email.</p>
  </div>
</body>
</html>`;

  const text = `
BOOKING CANCELLED

Hi ${data.userName},

Your appointment has been cancelled. Here are the details:

Business: ${data.businessName}
Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}

We're sorry to see you go. If you'd like to rebook, please visit our app.

Thank you for using Planity Clone!
`;

  return { subject, html, text };
}
