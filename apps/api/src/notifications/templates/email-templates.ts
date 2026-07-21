import { NotificationType, BookingData } from '../notification-channel.enum';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailTemplates {
  static getBookingConfirmation(data: BookingData): EmailTemplate {
    const subject = `Booking Confirmed - ${data.businessName}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .detail-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: bold; color: #6b7280; }
    .value { color: #111827; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Your appointment has been successfully booked. Here are the details:</p>
      
      <div class="detail-row">
        <span class="label">Business:</span>
        <span class="value">${data.businessName}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Service:</span>
        <span class="value">${data.serviceName}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Date:</span>
        <span class="value">${data.appointmentDate}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Time:</span>
        <span class="value">${data.appointmentTime}</span>
      </div>
      
      ${data.businessAddress ? `
      <div class="detail-row">
        <span class="label">Location:</span>
        <span class="value">${data.businessAddress}</span>
      </div>
      ` : ''}
      
      ${data.price !== undefined ? `
      <div class="detail-row">
        <span class="label">Price:</span>
        <span class="value">$${data.price.toFixed(2)}</span>
      </div>
      ` : ''}
      
      <p style="margin-top: 20px;">
        Please arrive a few minutes early. If you need to reschedule or cancel, 
        please do so at least 24 hours in advance.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message from Planity Clone.</p>
      <p>Questions? Contact support@planity-clone.com</p>
    </div>
  </div>
</body>
</html>`;

    const text = `Booking Confirmed!

Your appointment has been successfully booked.

Business: ${data.businessName}
Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
${data.businessAddress ? `Location: ${data.businessAddress}
` : ''}${data.price !== undefined ? `Price: $${data.price.toFixed(2)}
` : ''}
Please arrive a few minutes early.

Questions? Contact support@planity-clone.com`;

    return { subject, html, text };
  }

  static getBookingReminder(data: BookingData): EmailTemplate {
    const subject = `Reminder: Your appointment at ${data.businessName} tomorrow`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #F59E0B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .detail-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: bold; color: #6b7280; }
    .value { color: #111827; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Appointment Reminder</h1>
    </div>
    <div class="content">
      <p>This is a friendly reminder about your upcoming appointment:</p>
      
      <div class="detail-row">
        <span class="label">Business:</span>
        <span class="value">${data.businessName}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Service:</span>
        <span class="value">${data.serviceName}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Date:</span>
        <span class="value">${data.appointmentDate}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Time:</span>
        <span class="value">${data.appointmentTime}</span>
      </div>
      
      ${data.businessAddress ? `
      <div class="detail-row">
        <span class="label">Location:</span>
        <span class="value">${data.businessAddress}</span>
      </div>
      ` : ''}
      
      <p style="margin-top: 20px;">
        Please remember to arrive on time. We look forward to seeing you!
      </p>
    </div>
    <div class="footer">
      <p>This is an automated reminder from Planity Clone.</p>
    </div>
  </div>
</body>
</html>`;

    const text = `Appointment Reminder

Your upcoming appointment:

Business: ${data.businessName}
Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}
${data.businessAddress ? `Location: ${data.businessAddress}
` : ''}
Please arrive on time. We look forward to seeing you!`;

    return { subject, html, text };
  }

  static getBookingCancellation(data: BookingData): EmailTemplate {
    const subject = `Booking Cancelled - ${data.businessName}`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✕ Booking Cancelled</h1>
    </div>
    <div class="content">
      <p>Your appointment has been cancelled:</p>
      
      <p><strong>Business:</strong> ${data.businessName}</p>
      <p><strong>Service:</strong> ${data.serviceName}</p>
      <p><strong>Date:</strong> ${data.appointmentDate}</p>
      <p><strong>Time:</strong> ${data.appointmentTime}</p>
      
      <p style="margin-top: 20px;">
        If you did not request this cancellation or have any questions, 
        please contact us at support@planity-clone.com.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated message from Planity Clone.</p>
    </div>
  </div>
</body>
</html>`;

    const text = `Booking Cancelled

Your appointment has been cancelled:

Business: ${data.businessName}
Service: ${data.serviceName}
Date: ${data.appointmentDate}
Time: ${data.appointmentTime}

If you did not request this cancellation, please contact support@planity-clone.com.`;

    return { subject, html, text };
  }

  static getTemplate(type: NotificationType, data: BookingData): EmailTemplate {
    switch (type) {
      case NotificationType.BOOKING_CONFIRMATION:
        return this.getBookingConfirmation(data);
      case NotificationType.BOOKING_REMINDER:
        return this.getBookingReminder(data);
      case NotificationType.BOOKING_CANCELLATION:
        return this.getBookingCancellation(data);
      default:
        return this.getBookingConfirmation(data);
    }
  }
}
