import React from 'react';
import './DirectorsOffice.css';
import { FadeInUp, FadeInLeft, FadeInRight, StaggerContainer, StaggerItem, PageTransition } from '../components/ScrollAnimation';

const DirectorsOffice = () => {

  return (
    <PageTransition>
      <div className="directors-office">
        {/* Hero Section */}
        <section className="directors-hero">
          <div className="container">
            <div className="hero-content-wrapper">
              <FadeInUp delay={0.2}>
                <h1 className="directors-title">Meet Our Directors</h1>
              </FadeInUp>
              <FadeInUp delay={0.4}>
                <p className="directors-subtitle">
                  Guiding Sahas Uyana with vision and dedication to preserve and promote Sri Lankan culture.
                </p>
              </FadeInUp>
              <FadeInUp delay={0.6}>
                <div className="hero-cta">
                  <a href="#contact-directors" className="btn btn-primary hero-btn">
                    Contact Our Directors
                  </a>
                </div>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* First Director's Speech Section */}
        <section className="speech-section section">
          <div className="container">
            <div className="speech-content">
              <FadeInLeft>
                <div className="speech-image">
                  <div className="director-photo">
                    <img
                      src="https://i.postimg.cc/XYfYHz3V/Mangala.png"
                      alt="Mr. Mangala Mallimaarachi - Managing Director"
                      className="director-image"
                    />
                  </div>
                </div>
              </FadeInLeft>
              <FadeInRight delay={0.2}>
                <div className="speech-text">
                  <h2 className="speech-title">A Message from Our Managing Director</h2>
                  <div className="speech-quote">
                    <p>
                      At Sahas Uyana, we believe in creating more than just an event space or theme park—we are dedicated to building an iconic destination that blends sophistication with joy. From the very beginning, our vision has been to offer a place where versatility, prestige come together to host memorable experiences for every guest.
                    </p>
                    <p>
                      Our commitment is to provide a platform where families, friends, and communities can come together, whether it's for celebrations, cultural experiences, or simply a day of adventure. With carefully curated attractions, and authentic Sri Lankan cuisine, we aim to set new benchmarks in hospitality and entertainment.
                    </p>
                    <p>
                      It is our privilege to welcome you to Sahas Uyana—a destination where every moment is designed to be unforgettable.
                    </p>
                  </div>
                  <div className="speech-signature">
                    <div className="signature-name">Mr. Mangala Mallimaarachi</div>
                    <div className="signature-title">Managing Director, Sahas Uyana</div>
                  </div>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>

        {/* Second Director's Speech Section */}
        <section className="speech-section section">
          <div className="container">
            <div className="speech-content">
              <FadeInRight>
                <div className="speech-image">
                  <div className="director-photo">
                    <img
                      src="https://i.postimg.cc/XYfYHz3V/Mangala.png"
                      alt="Chairperson - Sahas Uyana"
                      className="director-image"
                    />
                  </div>
                </div>
              </FadeInRight>
              <FadeInLeft delay={0.2}>
                <div className="speech-text">
                  <h2 className="speech-title">A Message from Our Chairperson</h2>
                  <div className="speech-quote">
                    <p>
                      Sahas Uyana was built with one goal in mind: to bring people together in a space that celebrates life, culture, and togetherness. Nestled in the heart of Kandy, we are proud to offer not just thrilling rides and serene landscapes, but also a place where children laugh freely, families bond, and traditions are celebrated.
                    </p>
                    <p>
                      We take pride in showcasing the richness of Sri Lankan heritage through our authentic food stalls, vibrant performances, and warm hospitality. Every event and every visit here is designed to leave our guests with lasting memories and genuine joy.
                    </p>
                    <p>
                      As we continue to grow, our promise remains the same—to serve as a trusted destination where every visitor feels valued, connected, and inspired. Thank you for choosing Sahas Uyana to be part of your special moments.
                    </p>
                  </div>
                  <div className="speech-signature">
                    <div className="signature-name">Ms. aaaaaaaaaaaa</div>
                    <div className="signature-title">Chairperson, Sahas Uyana</div>
                  </div>
                </div>
              </FadeInLeft>
            </div>
          </div>
        </section>

        {/* Contact Directors */}
        <section id="contact-directors" className="contact-directors section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Get in Touch</h2>
              <p className="section-subtitle">
                Have questions or suggestions? We'd love to hear from you.
              </p>
            </FadeInUp>
            <div className="contact-content">
              <FadeInLeft delay={0.2}>
                <div className="contact-info">
                  <StaggerContainer>
                    <StaggerItem>
                      <div className="contact-item">
                        <div className="contact-icon">📧</div>
                        <div className="contact-details">
                          <h4>Email Us</h4>
                          <p>directors@sahasuyana.lk</p>
                        </div>
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div className="contact-item">
                        <div className="contact-icon">📞</div>
                        <div className="contact-details">
                          <h4>Call Us</h4>
                          <p>+94 81 234 5678</p>
                        </div>
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <div className="contact-item">
                        <div className="contact-icon">📍</div>
                        <div className="contact-details">
                          <h4>Visit Us</h4>
                          <p>Sahas Uyana, Kandy, Sri Lanka</p>
                        </div>
                      </div>
                    </StaggerItem>
                  </StaggerContainer>
                </div>
              </FadeInLeft>
              <FadeInRight delay={0.4}>
                <div className="contact-form">
                  <form>
                    <div className="form-row">
                      <div className="form-group">
                        <input type="text" placeholder="Your Name" required />
                      </div>
                      <div className="form-group">
                        <input type="email" placeholder="Your Email" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Subject" required />
                    </div>
                    <div className="form-group">
                      <textarea placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Send Message</button>
                  </form>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default DirectorsOffice;
