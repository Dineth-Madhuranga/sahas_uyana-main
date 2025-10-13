import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Set CSS variable for header height to be used by pages
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('.header');
      if (header) {
        const headerHeight = header.offsetHeight;
        const headerTop = parseInt(getComputedStyle(header).top) || 0;
        const totalSpace = headerHeight + headerTop;
        document.documentElement.style.setProperty('--header-total-height', `${totalSpace}px`);
      }
    };

    // Update on load and resize
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    // Also update after a short delay to ensure styles are applied
    const timer = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timer);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Detect mobile viewport
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handle = (e) => setIsMobile(e.matches);
    // init
    handle(mq);
    // subscribe
    mq.addEventListener ? mq.addEventListener('change', handle) : mq.addListener(handle);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handle) : mq.removeListener(handle);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        {/* Overlay removed to prevent dark dim layer and any stacking issues */}

        <div className="header-content">
          {/* Logo - Centered */}
          <div className="logo">
            <Link to="/">
              <img
                src="https://i.postimg.cc/V606gTTK/imgi-1-327028694-692281699014840-6610880966568510493-n-removebg-preview.png"
                alt="Sahas Uyana Logo"
                className="logo-image"
              />
            </Link>
          </div>

          {isMobile ? (
            // Single combined mobile menu
            <nav className={`nav nav-mobile ${isMenuOpen ? 'nav-open' : ''}`}>
              <ul className="nav-list">
                <li className="nav-item">
                  <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/venues" className={`nav-link ${isActive('/venues') ? 'active' : ''}`}>Venues</Link>
                </li>
                <li className="nav-item">
                  <Link to="/news" className={`nav-link ${isActive('/news') ? 'active' : ''}`}>News</Link>
                </li>
                <li className="nav-item">
                  <Link to="/directors-office" className={`nav-link ${isActive('/directors-office') ? 'active' : ''}`}>Director's Office</Link>
                </li>
                <li className="nav-item">
                  <Link to="/our-story" className={`nav-link ${isActive('/our-story') ? 'active' : ''}`}>Our Story</Link>
                </li>
                <li className="nav-item">
                  <Link to="/helabojun" className={`nav-link ${isActive('/helabojun') ? 'active' : ''}`}>Helabojun</Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
                </li>
                <li className="nav-item">
                  <Link to="/venues#booking-form" className="nav-link book-now-btn">Book Now</Link>
                </li>
              </ul>
            </nav>
          ) : (
            <>
              {/* Desktop: keep split menus */}
              <nav className={`nav nav-left ${isMenuOpen ? 'nav-open' : ''}`}>
                <ul className="nav-list">
                  <li className="nav-item"><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link></li>
                  <li className="nav-item"><Link to="/venues" className={`nav-link ${isActive('/venues') ? 'active' : ''}`}>Venues</Link></li>
                  <li className="nav-item"><Link to="/news" className={`nav-link ${isActive('/news') ? 'active' : ''}`}>News</Link></li>
                  <li className="nav-item"><Link to="/directors-office" className={`nav-link ${isActive('/directors-office') ? 'active' : ''}`}>Director's Office</Link></li>
                </ul>
              </nav>
              <nav className={`nav nav-right ${isMenuOpen ? 'nav-open' : ''}`}>
                <ul className="nav-list">
                  <li className="nav-item"><Link to="/our-story" className={`nav-link ${isActive('/our-story') ? 'active' : ''}`}>Our Story</Link></li>
                  <li className="nav-item"><Link to="/helabojun" className={`nav-link ${isActive('/helabojun') ? 'active' : ''}`}>Helabojun</Link></li>
                  <li className="nav-item"><Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link></li>
                  <li className="nav-item"><Link to="/venues#booking-form" className="nav-link book-now-btn">Book Now</Link></li>
                </ul>
              </nav>
            </>
          )}

          {/* Mobile menu toggle */}
          <button className={`mobile-menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation" aria-expanded={isMenuOpen}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
