const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Contact form submission endpoint
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required (name, email, subject, message)' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email to admin (sahasuyana1@gmail.com) - appears as direct email from sender
    const adminMailOptions = {
      from: `${name} <${email}>`, // Email appears to come directly from the sender
      to: process.env.EMAIL_USER || 'sahasuyana1@gmail.com',
      subject: subject, // Use original subject without prefix
      html: generateDirectContactEmail({ name, email, subject, message }),
      // Add headers to ensure proper delivery and reply functionality
      headers: {
        'Reply-To': email,
        'Return-Path': email
      }
    };

    // Confirmation email to sender
    const senderMailOptions = {
      from: process.env.EMAIL_FROM || 'Sahas Uyana <noreply@sahasuyana.lk>',
      to: email,
      subject: '✅ Message Received - Sahas Uyana',
      html: generateSenderConfirmationEmail({ name, subject })
    };

    // Send both emails
    try {
      const adminResult = await transporter.sendMail(adminMailOptions);
      console.log('Admin contact email sent:', adminResult.messageId);
      
      const senderResult = await transporter.sendMail(senderMailOptions);
      console.log('Sender confirmation email sent:', senderResult.messageId);
      
      res.json({ 
        message: 'Message sent successfully! We will get back to you soon.',
        success: true 
      });
    } catch (emailError) {
      console.error('Error sending contact emails:', emailError);
      res.status(500).json({ 
        message: 'Failed to send message. Please try again later.',
        success: false 
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Server error. Please try again later.',
      success: false 
    });
  }
});

// Generate direct contact email (appears as if sent directly from customer)
function generateDirectContactEmail({ name, email, subject, message }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background-color: #1976D2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .greeting { margin-bottom: 20px; font-size: 1.1rem; }
        .message-content { 
          background-color: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          line-height: 1.7;
          border-left: 4px solid #1976D2;
          font-size: 1.1rem;
        }
        .sender-details { 
          background-color: #e3f2fd; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0; 
        }
        .contact-info {
          background-color: #fff3e0;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #ff9800;
        }
        .footer { 
          background-color: #6c757d; 
          color: white; 
          padding: 15px; 
          text-align: center; 
          font-size: 12px; 
        }
        .highlight { color: #1976D2; font-weight: bold; }
        .message-icon { font-size: 1.2em; margin-right: 8px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>💬 New Message from Website</h1>
          <p>Contact Form Submission - Sahas Uyana</p>
        </div>
        <div class="content">
          <div class="greeting">
            <p>Hello Admin,</p>
            <p>You have received a new message through the Sahas Uyana website contact form.</p>
          </div>
          
          <div class="sender-details">
            <h3>👤 Sender Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <span class="highlight">${email}</span></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="message-content">
            <h3><span class="message-icon">📝</span>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>

          <div class="contact-info">
            <h3>📧 How to Respond:</h3>
            <ul>
              <li><strong>Quick Reply:</strong> Simply click "Reply" to respond directly to ${name}</li>
              <li><strong>Email Address:</strong> ${email}</li>
              <li><strong>Response Time:</strong> Please respond within 24 hours for best customer service</li>
            </ul>
          </div>

          <p><strong>🚨 Action Required:</strong> Please review and respond to this customer inquiry promptly.</p>
          
          <p>Best regards,<br><strong>Sahas Uyana Contact System</strong></p>
        </div>
        <div class="footer">
          <p>Sahas Uyana Cultural Center, Kandy, Sri Lanka</p>
          <p>This is an automated notification from the website contact form.</p>
          <p>Reply directly to this email to respond to the customer.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate admin notification email
function generateAdminContactEmail({ name, email, subject, message }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background-color: #1976D2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .message-details { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .sender-details { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .message-content { background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff9800; }
        .footer { background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .urgent { color: #dc3545; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📧 New Contact Form Message</h1>
          <p>Someone has sent a message through the website</p>
        </div>
        <div class="content">
          <p>Dear Admin,</p>
          <p>A new message has been received through the contact form on the Sahas Uyana website.</p>
          
          <div class="sender-details">
            <h3>👤 Sender Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>

          <div class="message-content">
            <h3>💬 Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>

          <div class="message-details">
            <h3>⚡ Action Required:</h3>
            <ul>
              <li>Review the message above</li>
              <li>Respond to the sender at: <strong>${email}</strong></li>
              <li>Provide helpful information or assistance</li>
              <li>Maintain professional customer service standards</li>
            </ul>
          </div>

          <p class="urgent">🚨 Please respond to this inquiry within 24 hours to maintain excellent customer service.</p>
          
          <p>Best regards,<br>Sahas Uyana Contact System</p>
        </div>
        <div class="footer">
          <p>Sahas Uyana Admin System - Contact Form Notification</p>
          <p>This is an automated notification. Please respond directly to the sender's email.</p>
          <p>Message received at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate sender confirmation email
function generateSenderConfirmationEmail({ name, subject }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .message-details { background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background-color: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }
        .success { color: #28a745; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>✅ Message Received</h1>
          <p>Thank you for contacting Sahas Uyana</p>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We have successfully received your message. Status: <span class="success">RECEIVED</span></p>
          
          <div class="message-details">
            <h3>📋 Your Message Details:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <h3>What Happens Next?</h3>
          <ul>
            <li>Our team will review your message within 24 hours</li>
            <li>We will respond directly to your email address</li>
            <li>For urgent matters, you can also call us directly</li>
            <li>Please keep this email as confirmation of your inquiry</li>
          </ul>

          <p>If you have any additional questions or need immediate assistance, please don't hesitate to contact us.</p>
          <p>Thank you for your interest in Sahas Uyana!</p>
        </div>
        <div class="footer">
          <p>Sahas Uyana Cultural Center, Kandy, Sri Lanka</p>
          <p>This is an automated confirmation. We will respond to your inquiry soon.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;
