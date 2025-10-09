import React, { useState, useEffect } from 'react';
import './BookingCalendar.css';

const BookingCalendar = ({ bookedDates = [], onDateSelect, onAdminBook }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    venue: ''
  });

  // Force update when bookedDates changes
  useEffect(() => {
    // Component re-renders when bookedDates prop changes
  }, [bookedDates]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const venues = [
    'Open Air Arena',
    'Open Area',
    'Conference Hall',
    'Banquet Hall',
    'Auditorium',
    'Vendor Stalls'
  ];

  const getVenueCode = (venueName) => {
    switch(venueName) {
      case 'Open Air Arena':
        return 'OAR';
      case 'Open Area':
        return 'OA';
      case 'Conference Hall':
        return 'CH';
      case 'Banquet Hall':
        return 'BH';
      case 'Auditorium':
        return 'AUD';
      case 'Vendor Stalls':
        return 'VS';
      default:
        return venueName.substring(0, 3).toUpperCase();
    }
  };

  // Get the first and last day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the first day of the month and number of days
  const firstDayOfWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Create array of dates for the calendar
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isDateBooked = (day) => {
    if (!day) return false;
    // Use consistent date formatting without timezone conversion
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;

    const isBooked = bookedDates.some(bookedDate => {
      // Handle both string and date formats consistently
      let bookedDateString;
      if (typeof bookedDate.date === 'string') {
        bookedDateString = bookedDate.date.split('T')[0]; // Handle ISO strings
      } else {
        const d = new Date(bookedDate.date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        bookedDateString = `${year}-${month}-${day}`;
      }
      return bookedDateString === dateString;
    });

    return isBooked;
  };

  const isDatePast = (day) => {
    if (!day) return false;
    const today = new Date();
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dateToCheck < today.setHours(0, 0, 0, 0);
  };

  const handleDateClick = (day) => {
    if (!day || isDatePast(day)) return;
    
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    if (onDateSelect) {
      onDateSelect(clickedDate);
    }
    
    // If this is admin panel, show booking modal
    if (onAdminBook) {
      setShowBookingModal(true);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !bookingForm.venue) {
      alert('Please select a venue');
      return;
    }

    // Use consistent date formatting without timezone conversion
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const bookingData = {
      date: dateString,
      venue: bookingForm.venue,
      eventType: 'other', // Default event type for admin blocks
      duration: 1, // Default duration
      notes: 'Admin blocked date',
      status: 'confirmed',
      bookedBy: 'admin'
    };

    try {
      await onAdminBook(bookingData);
      setShowBookingModal(false);
      setBookingForm({
        venue: ''
      });
      setSelectedDate(null);
      alert('Date blocked successfully!');
    } catch (error) {
      console.error('Error blocking date:', error);
      alert(`Error blocking date: ${error.message || 'Please try again.'}`);
    }
  };

  const getBookingDetails = (day) => {
    if (!day) return null;
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return bookedDates.find(bookedDate => {
      const bookedDateString = new Date(bookedDate.date).toISOString().split('T')[0];
      return bookedDateString === dateString;
    });
  };

  return (
    <div className="booking-calendar">
      <div className="calendar-header">
        <button 
          className="nav-btn" 
          onClick={() => navigateMonth(-1)}
          aria-label="Previous month"
        >
          &#8249;
        </button>
        <h3 className="calendar-title">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button 
          className="nav-btn" 
          onClick={() => navigateMonth(1)}
          aria-label="Next month"
        >
          &#8250;
        </button>
      </div>

      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => {
          const isBooked = isDateBooked(day);
          const isPast = isDatePast(day);
          const bookingDetails = getBookingDetails(day);
          
          return (
            <div
              key={index}
              className={`calendar-day ${day ? 'has-date' : 'empty'} ${
                isBooked ? 'booked' : ''
              } ${isPast ? 'past' : ''} ${
                selectedDate && day === selectedDate.getDate() && 
                currentDate.getMonth() === selectedDate.getMonth() &&
                currentDate.getFullYear() === selectedDate.getFullYear() ? 'selected' : ''
              }`}
              onClick={() => handleDateClick(day)}
              title={onAdminBook && bookingDetails ? `${bookingDetails.venue} - ${bookingDetails.eventType}` : ''}
            >
              {day && (
                <>
                  <span className="day-number">{day}</span>
                  {onAdminBook && isBooked && bookingDetails && (
                    <div className="booking-indicator">
                      <span className="venue-code">{getVenueCode(bookingDetails.venue)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-color past"></span>
          <span>Past Date</span>
        </div>
      </div>

      {/* Venue Codes Legend */}
      {onAdminBook && (
        <div className="venue-codes-legend">
          <h4>Venue Codes</h4>
          <div className="venue-codes-list">
            <div className="venue-code-item">
              <span className="venue-code-badge">OAR</span>
              <span>Open Air Arena</span>
            </div>
            <div className="venue-code-item">
              <span className="venue-code-badge">OA</span>
              <span>Open Area</span>
            </div>
            <div className="venue-code-item">
              <span className="venue-code-badge">CH</span>
              <span>Conference Hall</span>
            </div>
            <div className="venue-code-item">
              <span className="venue-code-badge">BH</span>
              <span>Banquet Hall</span>
            </div>
            <div className="venue-code-item">
              <span className="venue-code-badge">AUD</span>
              <span>Auditorium</span>
            </div>
            <div className="venue-code-item">
              <span className="venue-code-badge">VS</span>
              <span>Vendor Stalls</span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Booking Modal */}
      {showBookingModal && onAdminBook && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="modal-header">
              <h3>Block Date: {selectedDate?.toLocaleDateString()}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="venue">Select Venue to Block *</label>
                <select
                  id="venue"
                  value={bookingForm.venue}
                  onChange={(e) => setBookingForm({...bookingForm, venue: e.target.value})}
                  required
                >
                  <option value="">Select Venue</option>
                  {venues.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>
              
              <div className="admin-block-info">
                <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                <p><strong>Duration:</strong> 1 day (default)</p>
                <p><strong>Type:</strong> Admin Block</p>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowBookingModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Block Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
