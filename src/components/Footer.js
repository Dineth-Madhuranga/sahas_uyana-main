import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import './Footer.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="https://i.postimg.cc/V606gTTK/imgi-1-327028694-692281699014840-6610880966568510493-n-removebg-preview.png" 
                alt="Sahas Uyana Logo" 
                className="footer-logo-image"
              />
              <img 
                src="https://i.postimg.cc/Dzz4rS5P/b3119613c2a06c7a54896ad9b7b30e68.png" 
                alt="Sahas Uyana" 
                className="footer-text-image"
              />
            </div>
            <p className="footer-description">
              A cultural and leisure venue in the heart of Kandy, Sri Lanka.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">NAVIGATION</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/venues">Venues</Link></li>
              <li><Link to="/helabojun">Helabojun</Link></li>
              <li><Link to="/news">News</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">ABOUT</h3>
            <ul className="footer-links">
              <li><Link to="/our-story">Our Story</Link></li>
              <li><Link to="/directors-office">Director's Office</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">FOLLOW US</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/sahasuyana" className="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook className="social-icon" size={20} />
                Facebook
              </a>
              <a href="https://www.instagram.com/sahasuyana" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram className="social-icon" size={20} />
                Instagram
              </a>
              <a href="https://twitter.com" className="social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter className="social-icon" size={20} />
                Twitter
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">CONTACT US</h3>
            <div className="contact-info">
              <p>Sahas Uyana, Ehelepola Kumarihami Mawatha, Kandy</p>
              <p>sahasuyana@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Sahas Uyana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
