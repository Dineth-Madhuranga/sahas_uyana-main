const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendBookingConfirmation(booking) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Sahas Uyana <noreply@sahasuyana.lk>',
      to: booking.customer.email,
      subject: '✅ Booking Confirmed - Sahas Uyana',
      html: this.generateConfirmationEmail(booking)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Confirmation email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }

  async sendBookingRejection(booking, reason) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Sahas Uyana <noreply@sahasuyana.lk>',
      to: booking.customer.email,
      subject: '❌ Booking Request Update - Sahas Uyana',
      html: this.generateRejectionEmail(booking, reason)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Rejection email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending rejection email:', error);
      throw error;
    }
  }

  async sendBookingSubmission(booking) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Sahas Uyana <noreply@sahasuyana.lk>',
      to: booking.customer.email,
      subject: '📝 Booking Request Received - Sahas Uyana',
      html: this.generateSubmissionEmail(booking)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Submission email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending submission email:', error);
      throw error;
    }
  }

  generateConfirmationEmail(booking) {
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
          .header { background-color: #2c5530; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .status-approved { color: #28a745; font-weight: bold; }
          .footer { background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your booking at Sahas Uyana has been approved</p>
          </div>
          <div class="content">
            <p>Dear ${booking.customer.name},</p>
            <p>Great news! Your booking request has been <span class="status-approved">APPROVED</span>.</p>
            
            <div class="booking-details">
              <h3>Booking Details:</h3>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Venue:</strong> ${booking.venue}</p>
              <p><strong>Event Type:</strong> ${booking.eventType}</p>
              <p><strong>Event Date:</strong> ${eventDate}</p>
              <p><strong>Duration:</strong> ${booking.duration} day(s)</p>
              <p><strong>Expected Guests:</strong> ${booking.guests}</p>
              <p><strong>Total Amount:</strong> LKR ${booking.totalAmount.toLocaleString()}</p>
              ${booking.specialRequirements ? `<p><strong>Special Requirements:</strong> ${booking.specialRequirements}</p>` : ''}
            </div>

            <h3>What's Next?</h3>
            <ul>
              <li>Your date has been reserved and blocked for other bookings</li>
              <li>We will contact you within 2 business days to discuss payment and final arrangements</li>
              <li>Please keep this email as confirmation of your booking</li>
            </ul>

            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Thank you for choosing Sahas Uyana!</p>
          </div>
          <div class="footer">
            <p>Sahas Uyana Cultural Center, Kandy, Sri Lanka</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateRejectionEmail(booking, reason) {
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
          .status-rejected { color: #dc3545; font-weight: bold; }
          .footer { background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Booking Request Update</h1>
            <p>Regarding your booking at Sahas Uyana</p>
          </div>
          <div class="content">
            <p>Dear ${booking.customer.name},</p>
            <p>We regret to inform you that your booking request has been <span class="status-rejected">DECLINED</span>.</p>
            
            <div class="booking-details">
              <h3>Booking Details:</h3>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Venue:</strong> ${booking.venue}</p>
              <p><strong>Event Type:</strong> ${booking.eventType}</p>
              <p><strong>Requested Date:</strong> ${eventDate}</p>
              <p><strong>Duration:</strong> ${booking.duration} day(s)</p>
              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            </div>

            <h3>Alternative Options:</h3>
            <ul>
              <li>Consider alternative dates - we may have availability on nearby dates</li>
              <li>Explore other venues that might suit your event</li>
              <li>Contact us directly to discuss modified arrangements</li>
            </ul>

            <p>Please feel free to submit a new booking request with alternative dates or contact us for assistance.</p>
            <p>Thank you for your interest in Sahas Uyana.</p>
          </div>
          <div class="footer">
            <p>Sahas Uyana Cultural Center, Kandy, Sri Lanka</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateSubmissionEmail(booking) {
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
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .booking-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .status-pending { color: #ffc107; font-weight: bold; }
          .footer { background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📝 Booking Request Received</h1>
            <p>Thank you for choosing Sahas Uyana</p>
          </div>
          <div class="content">
            <p>Dear ${booking.customer.name},</p>
            <p>We have successfully received your booking request. Status: <span class="status-pending">PENDING REVIEW</span></p>
            
            <div class="booking-details">
              <h3>Your Booking Request:</h3>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Venue:</strong> ${booking.venue}</p>
              <p><strong>Event Type:</strong> ${booking.eventType}</p>
              <p><strong>Event Date:</strong> ${eventDate}</p>
              <p><strong>Duration:</strong> ${booking.duration} day(s)</p>
              <p><strong>Expected Guests:</strong> ${booking.guests}</p>
              <p><strong>Estimated Amount:</strong> LKR ${booking.totalAmount.toLocaleString()}</p>
            </div>

            <h3>What Happens Next?</h3>
            <ul>
              <li>Our team will review your booking request within 24-48 hours</li>
              <li>We will check venue availability for your requested date</li>
              <li>You will receive an email notification with the approval status</li>
              <li>If approved, we will contact you to finalize payment and arrangements</li>
            </ul>

            <p>If you need to make any changes or have questions, please contact us immediately.</p>
            <p>Thank you for choosing Sahas Uyana!</p>
          </div>
          <div class="footer">
            <p>Sahas Uyana Cultural Center, Kandy, Sri Lanka</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();