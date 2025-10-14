import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Venues from './pages/Venues';
import Helabojun from './pages/Helabojun';
import News from './pages/News';
import OurStory from './pages/OurStory';
import DirectorsOffice from './pages/DirectorsOffice';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { ToastProvider } from './components/ToastProvider';

function App() {
  // Mobile viewport height fix for address bar issue
  useEffect(() => {
    const setVH = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      // Set the CSS variable --vh for use in CSS
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on initial mount
    setVH();

    // Update on window resize
    window.addEventListener('resize', setVH);

    // Update on orientation change
    window.addEventListener('orientationchange', setVH);

    // Also trigger after a small delay to handle browser chrome appearing/disappearing
    setTimeout(setVH, 100);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <Header />
                <main>
                  <Home />
                </main>
                <Footer />
              </>
            } />
            <Route path="/venues" element={
              <>
                <Header />
                <main>
                  <Venues />
                </main>
                <Footer />
              </>
            } />
            <Route path="/helabojun" element={
              <>
                <Header />
                <main>
                  <Helabojun />
                </main>
                <Footer />
              </>
            } />
            <Route path="/news" element={
              <>
                <Header />
                <main>
                  <News />
                </main>
                <Footer />
              </>
            } />
            <Route path="/our-story" element={
              <>
                <Header />
                <main>
                  <OurStory />
                </main>
                <Footer />
              </>
            } />
            <Route path="/directors-office" element={
              <>
                <Header />
                <main>
                  <DirectorsOffice />
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <main>
                  <Contact />
                </main>
                <Footer />
              </>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </ToastProvider>
    </Router>
  );
}

export default App;