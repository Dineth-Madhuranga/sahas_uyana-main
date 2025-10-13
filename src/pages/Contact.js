import React, { useState } from 'react';
import './Contact.css';
import { FadeInUp, FadeInLeft, FadeInRight, PageTransition, StaggerContainer, StaggerItem, CardHover } from '../components/ScrollAnimation';
import API_BASE_URL from '../config/api';
import { useToast } from '../components/ToastProvider';

const Contact = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Message sent! We will get back to you soon. A confirmation email has been sent.', { type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast(result.message || 'Failed to send message. Please try again.', { type: 'error' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message. Please check your connection and try again.', { type: 'error' });
    }
  };

  return (
    <PageTransition>
      <div className="contact">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <FadeInUp delay={0.2}>
              <h1 className="contact-title">Get in Touch</h1>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p className="contact-subtitle">
                We're here to help! Reach out to us with any questions or inquiries.
                Our team is dedicated to providing you with the best possible experience at Sahas Uyana.
              </p>
            </FadeInUp>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="contact-main section">
          <div className="container">
            <div className="contact-content">
              <FadeInLeft>
                <div className="contact-form-section">
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter the subject"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Type your message here"
                        rows="6"
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary send-message-btn">
                      Send Message
                    </button>
                  </form>
                </div>
              </FadeInLeft>

              <FadeInRight delay={0.2}>
                <div className="contact-map-section">
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3296.693499017949!2d80.63532545750566!3d7.2914153185732635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae367adc2d9f5d9%3A0xa01266c114784439!2sSahas%20Uyana!5e1!3m2!1sen!2slk!4v1759130861384!5m2!1sen!2slk"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Sahas Uyana Location"
                    ></iframe>
                  </div>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="contact-info-section section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Contact Information</h2>
            </FadeInUp>
            <StaggerContainer>
              <div className="info-grid">
                <StaggerItem>
                  <CardHover>
                    <div className="info-card card">
                      <div className="info-icon">📍</div>
                      <h3>Address</h3>
                      <p>Sahas Uyana<br />Kandy, Sri Lanka</p>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="info-card card">
                      <div className="info-icon">📞</div>
                      <h3>Phone</h3>
                      <p>+94 81 234 5678<br />+94 81 234 5679</p>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="info-card card">
                      <div className="info-icon">📧</div>
                      <h3>Email</h3>
                      <p>sahasuyana@gmail.com</p>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="info-card card">
                      <div className="info-icon">🕒</div>
                      <h3>Hours</h3>
                      <p>Daily: 9:00 AM - 10:00 PM<br />24/7 for events</p>
                    </div>
                  </CardHover>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* EV Information */}
        <section className="ev-info-section section">
          <div className="container">
            <div className="ev-content">
              <FadeInLeft delay={0.2}>
                <div className="ev-text">
                  <h2 className="section-title">EV Charging Station</h2>
                  <p className="ev-description">
                    We're committed to sustainability and modern convenience. Our EV charging station
                    is available for visitors with electric vehicles, featuring fast charging capabilities
                    and competitive rates.
                  </p>
                  <div className="ev-features">
                    <div className="ev-feature">
                      <div className="feature-icon">⚡</div>
                      <div className="feature-text">
                        <h4>Fast Charging</h4>
                        <p>Quick charge your vehicle with our high-speed chargers</p>
                      </div>
                    </div>
                    <div className="ev-feature">
                      <div className="feature-icon">💰</div>
                      <div className="feature-text">
                        <h4>Competitive Rates</h4>
                        <p>Affordable pricing for all charging sessions</p>
                      </div>
                    </div>
                    <div className="ev-feature">
                      <div className="feature-icon">24/7</div>
                      <div className="feature-text">
                        <h4>Always Available</h4>
                        <p>Access our charging stations anytime, day or night</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInLeft>
              <FadeInRight delay={0.4}>
                <div className="ev-image">
                  <div className="ev-placeholder">
                    <div className="ev-icon">🔋</div>
                    <div className="ev-text-overlay">EV Charging Station</div>
                  </div>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </FadeInUp>
            <div className="faq-content">
              <div className="faq-item">
                <h3>What are your opening hours?</h3>
                <p>We're open daily from 9:00 AM to 10:00 PM. For special events, we can accommodate 24/7 access with prior arrangement.</p>
              </div>
              <div className="faq-item">
                <h3>Do you offer parking facilities?</h3>
                <p>Yes, we have ample parking space for cars, buses, and motorcycles. EV charging stations are also available.</p>
              </div>
              <div className="faq-item">
                <h3>Can I book venues for private events?</h3>
                <p>Absolutely! Our venues are perfect for weddings, corporate events, birthday parties, and cultural celebrations. Visit our Venues page or contact us for booking details.</p>
              </div>
              <div className="faq-item">
                <h3>Are pets allowed?</h3>
                <p>Service animals are welcome. For other pets, please contact us in advance to discuss arrangements.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;