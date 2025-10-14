import React from 'react';
import './OurStory.css';
import { FadeInUp, FadeInLeft, FadeInRight, StaggerContainer, StaggerItem, CardHover, PageTransition } from '../components/ScrollAnimation';

const OurStory = () => {
  const timelineEvents = [
    {
      year: "2005",
      title: "Founding of Sahas Uyana",
      description: "Sahas Uyana was born from a vision to create a space that celebrates Sri Lankan culture while offering a modern leisure experience. The founders, a group of local artists and entrepreneurs, envisioned a sanctuary where nature, art, and community could thrive together.",
      icon: "⭐"
    },
    {
      year: "2010 - 2015",
      title: "Expansion and Development",
      description: "The following years saw significant growth. New venues were added, including an open-air amphitheater and modern art gallery. The 'Helabojun' food court was introduced, quickly becoming a favorite for its authentic Sri Lankan cuisine.",
      icon: "📈"
    },
    {
      year: "2016 - Present",
      title: "Cultural Events and Recognition",
      description: "Sahas Uyana became a hub for major cultural festivals, attracting international artists and visitors. It received national awards for its contribution to tourism and cultural preservation, solidifying its reputation as a premier cultural destination in Kandy.",
      icon: "🏆"
    }
  ];

  const values = [
    {
      title: "Cultural Preservation",
      description: "We are committed to preserving and promoting the rich cultural heritage of Sri Lanka through authentic experiences and traditional practices.",
      icon: "🏛️"
    },
    {
      title: "Community Engagement",
      description: "Building strong connections with local communities and providing a platform for cultural exchange and mutual understanding.",
      icon: "🤝"
    },
    {
      title: "Environmental Sustainability",
      description: "Maintaining harmony with nature and implementing sustainable practices to protect our environment for future generations.",
      icon: "🌱"
    },
    {
      title: "Excellence in Service",
      description: "Delivering exceptional experiences through dedicated service, modern amenities, and attention to detail in every aspect of our operations.",
      icon: "⭐"
    }
  ];

  return (
    <PageTransition>
      <div className="our-story">
        {/* Hero Section */}
        <section className="story-hero">
          <div className="hero-content">
            <FadeInUp delay={0.2}>
              <h1>Our Story</h1>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p>
                Discover the rich history and vision of Sahas Uyana, a cultural and leisure venue in Kandy, Sri Lanka.
              </p>
            </FadeInUp>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section section">
          <div className="container">
            <StaggerContainer>
              <div className="timeline">
                {timelineEvents.map((event, index) => (
                  <StaggerItem key={index}>
                    <div className="timeline-item">
                      <div className="timeline-marker">
                        <div className="timeline-icon">{event.icon}</div>
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-year">{event.year}</div>
                        <h3 className="timeline-title">{event.title}</h3>
                        <p className="timeline-description">{event.description}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-section section">
          <div className="container">
            <div className="mission-content">
              <FadeInLeft>
                <div className="mission-text">
                  <h2 className="section-title">Our Mission & Vision</h2>
                  <div className="mission-item">
                    <h3>Mission</h3>
                    <p>
                      To create a vibrant cultural hub that celebrates Sri Lankan heritage while providing
                      modern amenities and experiences that bring communities together and promote cultural
                      understanding and appreciation.
                    </p>
                  </div>
                  <div className="mission-item">
                    <h3>Vision</h3>
                    <p>
                      To be the premier cultural and leisure destination in Sri Lanka, recognized for our
                      commitment to preserving traditions, fostering community connections, and providing
                      exceptional experiences that inspire and delight visitors from around the world.
                    </p>
                  </div>
                </div>
              </FadeInLeft>
              <FadeInRight delay={0.2}>
                <div className="mission-image">
                  <div className="mission-placeholder">
                    <div className="mission-icon">🎭</div>
                    <div className="mission-text-overlay">Cultural Heritage</div>
                  </div>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Our Values</h2>
              <p className="section-subtitle">
                The principles that guide everything we do at Sahas Uyana
              </p>
            </FadeInUp>
            <StaggerContainer>
              <div className="values-grid">
                {values.map((value, index) => (
                  <StaggerItem key={index}>
                    <CardHover>
                      <div className="value-card card">
                        <div className="value-icon">{value.icon}</div>
                        <h3 className="value-title">{value.title}</h3>
                        <p className="value-description">{value.description}</p>
                      </div>
                    </CardHover>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section section">
          <div className="container">
            <FadeInUp>
              <h2 className="section-title">Our Team</h2>
              <p className="section-subtitle">
                Meet the passionate individuals who make Sahas Uyana special
              </p>
            </FadeInUp>
            <div className="team-content">
              <FadeInLeft delay={0.2}>
                <div className="team-text">
                  <p>
                    Our team consists of dedicated professionals, cultural enthusiasts, and local community
                    members who share a common passion for preserving and promoting Sri Lankan culture.
                    From our event coordinators to our culinary experts, each team member brings unique
                    skills and perspectives that contribute to the exceptional experiences we provide.
                  </p>
                  <p>
                    We believe in continuous learning, cultural exchange, and maintaining the highest
                    standards of service. Our team regularly participates in cultural workshops,
                    community events, and professional development programs to ensure we stay at the
                    forefront of cultural preservation and hospitality excellence.
                  </p>
                </div>
              </FadeInLeft>
              <FadeInRight delay={0.4}>
                <div className="team-image">
                  <div className="team-placeholder">
                    <div className="team-icon">👥</div>
                    <div className="team-text-overlay">Our Dedicated Team</div>
                  </div>
                </div>
              </FadeInRight>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default OurStory;
