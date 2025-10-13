import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { FadeInUp, FadeInLeft, FadeInRight, StaggerContainer, StaggerItem, CardHover, PageTransition } from '../components/ScrollAnimation';

const Home = () => {
  return (
    <PageTransition>
      <div className="home">
        {/* Hero Section */}
        <section className="hero">
          <FadeInLeft>
            <div className="hero-content">
              <FadeInUp delay={0.2}>
                <h1 className="hero-title">
                  <img src="https://i.postimg.cc/Dzz4rS5P/b3119613c2a06c7a54896ad9b7b30e68.png" alt="සහස් උයන" />
                  <img src="https://i.postimg.cc/qRx8wPy8/39a6b8d26537ce97e9d955271f0da2c5.png" alt="සහස් උයන" />
                  <img src="https://i.postimg.cc/B6MG3w6W/df579f082ecb2d43f86f882bc96e3392.png" alt="සහස් උයන" />
                </h1>
              </FadeInUp>
              <FadeInUp delay={0.4}>
                <p className="hero-subtitle">
                  Sahas Uyana has been created with the aim of providing a comfortable destination for the devotees who visit the Temple of the Tooth in Kandy. The Sahas Uyana is made up of several parks, including an outdoor theater, a handicrafts mall, a dining hall, a recreation area and a children's park.
                </p>
              </FadeInUp>
              <FadeInUp delay={0.6}>
                <div className="hero-actions">
                  <Link to="/venues#booking-form" className="btn btn-primary hero-btn">
                    Book Your Experience
                  </Link>
                </div>
              </FadeInUp>
            </div>
          </FadeInLeft>
          <FadeInRight delay={0.3}>
            <div className="hero-image">
              <div className="hero-placeholder">
              </div>
            </div>
          </FadeInRight>
        </section>

        {/* Features Section */}
        <section className="features section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Why Choose Sahas Uyana?</h2>
              <p className="section-subtitle">
                Experience the perfect blend of culture, nature, and modern amenities
              </p>
            </FadeInUp>
            <StaggerContainer>
              <div className="grid grid-3">
                <StaggerItem>
                  <CardHover>
                    <div className="feature-card card">
                      <div className="feature-icon">🍽️</div>
                      <h3>Hygienic & Affordable Meals</h3>
                      <p>Enjoy hygienic and affordable meals at the food court</p>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="feature-card card">
                      <div className="feature-icon">🎪</div>
                      <h3>Various Attractions</h3>
                      <p>Explore various attractions like the outdoor theater, handicrafts mall, and children's park within the free entrance park</p>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="feature-card card">
                      <div className="feature-icon">🌳</div>
                      <h3>Peaceful Setting</h3>
                      <p>Bond with family or friends in a peaceful setting despite being centrally located</p>
                    </div>
                  </CardHover>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Venues Preview */}
        <section className="venues-preview section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Our Venues</h2>
              <p className="section-subtitle">
                Discover the perfect setting for your next event
              </p>
            </FadeInUp>
            <StaggerContainer>
              <div className="grid grid-4">
                <StaggerItem>
                  <CardHover>
                    <div className="venue-card card">
                      <div className="venue-image">
                        <div className="venue-placeholder">Open Air Arena</div>
                        <div className="venue-badge">Available</div>
                      </div>
                      <div className="venue-content">
                        <h3>Open Air Arena</h3>
                        <p>Roofed arena with 26x26 metal stage and 8,000 seating capacity. Perfect for musical shows, political gatherings, acoustic concerts, exhibitions/fairs, group meetings, and classes.</p>
                        <div className="venue-price">LKR 1,250,000 per day</div>
                        <Link to="/venues" className="btn btn-primary">Learn More</Link>
                      </div>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="venue-card card">
                      <div className="venue-image">
                        <div className="venue-placeholder">Open Area</div>
                        <div className="venue-badge">Available</div>
                      </div>
                      <div className="venue-content">
                        <h3>Open Area</h3>
                        <p>Flexible outdoor space ideal for exhibitions and fairs with variable capacity arrangements.</p>
                        <div className="venue-price">LKR 150,000 per day</div>
                        <Link to="/venues" className="btn btn-primary">Learn More</Link>
                      </div>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="venue-card card">
                      <div className="venue-image">
                        <div className="venue-placeholder">Vendor Stalls</div>
                        <div className="venue-badge">85 Available</div>
                      </div>
                      <div className="venue-content">
                        <h3>Vendor Stalls</h3>
                        <p>100 total stalls (6x4 feet each) perfect for small businesses and market vendors. Monthly rental basis.</p>
                        <div className="venue-price">LKR 30,000 per month</div>
                        <Link to="/venues" className="btn btn-primary">Learn More</Link>
                      </div>
                    </div>
                  </CardHover>
                </StaggerItem>
                <StaggerItem>
                  <CardHover>
                    <div className="venue-card card">
                      <div className="venue-image">
                        <div className="venue-placeholder">Kids Park</div>
                        <div className="venue-badge">Free Access</div>
                      </div>
                      <div className="venue-content">
                        <h3>Kids Park</h3>
                        <p>Free recreational area designed for children and families with safe play equipment and family-friendly facilities.</p>
                        <div className="venue-price">Free of charge</div>
                        <span className="btn btn-secondary disabled">Free Access</span>
                      </div>
                    </div>
                  </CardHover>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* EV Charging Station */}
        <section className="ev-station section">
          <div className="container">
            <div className="ev-content">
              <FadeInLeft>
                <div className="ev-info">
                  <h2>EV Charging Station</h2>
                  <p>We're committed to sustainability and modern convenience. Our EV charging station is available for visitors with electric vehicles.</p>
                  <ul className="ev-features">
                    <li>Fast charging available</li>
                    <li>Dual Guns</li>
                    <li>24/7 access</li>
                    <li>Competitive rates</li>
                  </ul>
                </div>
              </FadeInLeft>
              <FadeInRight delay={0.2}>
                <div className="ev-icon">⚡</div>
              </FadeInRight>
            </div>
          </div>
        </section>

        {/* Parking Section */}
        <section className="parking section">
          <div className="container">
            <div className="parking-content">
              <FadeInRight>
                <div className="parking-icon">🅿️</div>
              </FadeInRight>
              <FadeInLeft delay={0.2}>
                <div className="parking-info">
                  <h2>Convenient Parking</h2>
                  <p>Sahas Uyana offers ample parking space for all visitors, ensuring a hassle-free experience for your events and visits.</p>
                  <ul className="parking-features">
                    <li>Free parking for all visitors</li>
                    <li>EV charging stations available</li>
                    <li>Security surveillance 24/7</li>
                    <li>Easy access and multiple entry points</li>
                  </ul>
                </div>
              </FadeInLeft>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;