const nodemailer = require('nodemailer');

class AdminEmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendBookingNotificationToAdmin(booking) {
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || 'Sahas Uyana <noreply@sahasuyana.lk>',
      to: process.env.EMAIL_USER || 'sahasuyana1@gmail.com',
      subject: '🔔 New Booking Request - Admin Notification',
      html: this.generateAdminNotificationEmail(booking)
    };

    try {
      const result = await this.transporter.sendMail(adminMailOptions);
      console.log('Admin notification email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending admin notification email:', error);
      throw error;
    }
  }

  generateAdminNotificationEmail(booking) {
    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .customer-details { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .status-new { color: #dc3545; font-weight: bold; }
          .footer { background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }
          .highlight { background-color: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🔔 New Booking Request</h1>
            <p>Admin Notification - Action Required</p>
          </div>
          <div class="content">
            <p>Dear Admin,</p>
            <p>A new booking request has been received and requires your review. Status: <span class="status-new">PENDING APPROVAL</span></p>
            
            <div class="booking-details">
              <h3>📋 Booking Details:</h3>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Venue:</strong> ${booking.venue}</p>
              <p><strong>Event Type:</strong> ${booking.eventType}</p>
              <p><strong>Event Date:</strong> ${eventDate}</p>
              <p><strong>Duration:</strong> ${booking.duration} day(s)</p>
              <p><strong>Expected Guests:</strong> ${booking.guests}</p>
              <p><strong>Total Amount:</strong> LKR ${booking.totalAmount.toLocaleString()}</p>
              ${booking.specialRequirements ? `<p><strong>Special Requirements:</strong> ${booking.specialRequirements}</p>` : ''}
              ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
              ${booking.stallInfo ? `<p><strong>Stall Info:</strong> ${booking.stallInfo.stallId} (Block ${booking.stallInfo.block}, Stall ${booking.stallInfo.stallNumber})</p>` : ''}
            </div>

            <div class="customer-details">
              <h3>👤 Customer Information:</h3>
              <p><strong>Name:</strong> ${booking.customer.name}</p>
              <p><strong>Email:</strong> ${booking.customer.email}</p>
              <p><strong>Phone:</strong> ${booking.customer.phone}</p>
            </div>

            <div class="highlight">
              <h3>⚡ Required Actions:</h3>
              <ul>
                <li>Review the booking request details above</li>
                <li>Check venue availability for the requested date</li>
                <li>Log in to the admin dashboard to approve or reject</li>
                <li>Customer will be automatically notified of your decision</li>
              </ul>
            </div>

            <p><strong>🚨 Please process this booking request as soon as possible to maintain customer satisfaction.</strong></p>
            
            <p>Best regards,<br>Sahas Uyana Booking System</p>
          </div>
          <div class="footer">
            <p>Sahas Uyana Admin System - Automated Notification</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
            <p>Booking submitted at: ${new Date(booking.createdAt || new Date()).toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new AdminEmailService();
