import React, { useState, useEffect } from 'react';
import './Venues.css';
import { FadeInUp, StaggerContainer, StaggerItem, CardHover, PageTransition, ScaleIn } from '../components/ScrollAnimation';
import { useToast } from '../components/ToastProvider';
import API_BASE_URL from '../config/api';

const Venues = () => {
  const { showToast } = useToast();
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedVenueForBooking, setSelectedVenueForBooking] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [bookedDatesWithDetails, setBookedDatesWithDetails] = useState([]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [vendorStallAvailability, setVendorStallAvailability] = useState({
    totalStalls: 100,
    availableStalls: 100,
    rentedStalls: 0
  });
  const [showStallSelector, setShowStallSelector] = useState(false);
  const [selectedStall, setSelectedStall] = useState(null);
  const [bookedStalls, setBookedStalls] = useState([]);

  // Vendor stall configuration
  const stallBlocks = {
    A: { count: 16, name: 'Block A' },
    B: { count: 24, name: 'Block B' },
    C: { count: 20, name: 'Block C' },
    D: { count: 16, name: 'Block D' },
    E: { count: 12, name: 'Block E' },
    F: { count: 12, name: 'Block F' }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: '',
    eventType: '',
    duration: ''
  });

  // Scroll to booking form if URL contains #booking-form
  useEffect(() => {
    if (window.location.hash === '#booking-form') {
      setTimeout(() => {
        const bookingSection = document.getElementById('booking-form');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  // Fetch unavailable dates when venue is selected
  useEffect(() => {
    if (selectedVenueForBooking) {
      fetchUnavailableDates();
      // If vendor stalls selected, fetch initial availability and booked stalls
      if (selectedVenueForBooking === '3') {
        fetchVendorStallAvailability(new Date().toISOString().split('T')[0]);
        fetchBookedStalls();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVenueForBooking, currentMonth, currentYear]);

  const fetchUnavailableDates = async () => {
    if (!selectedVenueForBooking) return;

    const venue = venues.find(v => v.id === selectedVenueForBooking);

    // Skip calendar date blocking for vendor stalls - they don't use calendar availability
    if (selectedVenueForBooking === '3' || venue.name === 'Vendor Stalls') {
      console.log('Skipping calendar fetch for vendor stalls - they use stall-based availability');
      setUnavailableDates([]);
      setBookedDatesWithDetails([]);
      return;
    }

    try {
      console.log('Fetching unavailable dates for venue:', venue.name);

      // Fetch all bookings excluding vendor stalls (they don't block calendar dates)
      const allBookingsResponse = await fetch(`${API_BASE_URL}/api/bookings?excludeVendorStalls=true`);

      let allUnavailableDates = [];
      let bookedDatesDetails = [];

      // Get all confirmed bookings with details
      if (allBookingsResponse.ok) {
        const responseData = await allBookingsResponse.json();
        console.log('Fetched bookings response:', responseData);

        // Handle both direct array and nested bookings structure
        const allBookingsData = responseData.bookings || responseData;
        console.log('Processing bookings array:', allBookingsData);

        // Process all bookings to extract date and details - filter by current venue
        allBookingsData
          .filter(booking => {
            const bookingVenue = booking.venue;
            const targetVenue = venue.name;
            console.log('Comparing venues:', bookingVenue, 'vs', targetVenue);
            console.log('Booking status:', booking.status);
            console.log('Customer name:', booking.customer ? booking.customer.name : 'No customer');
            return bookingVenue === targetVenue && booking.status === 'confirmed';
          })
          .forEach(booking => {
            console.log('Processing confirmed booking for venue:', booking);
            const eventDate = booking.eventDate || booking.date;
            if (eventDate) {
              // Parse date consistently to avoid timezone shifts
              let startY, startM, startD;
              if (typeof eventDate === 'string') {
                const base = eventDate.split('T')[0];
                const [y, m, d] = base.split('-').map(n => parseInt(n, 10));
                startY = y;
                startM = (m - 1); // JavaScript months are 0-indexed
                startD = d;
              } else {
                // For Date objects, use local date components to avoid timezone issues
                const start = new Date(eventDate);
                startY = start.getFullYear();
                startM = start.getMonth();
                startD = start.getDate();
              }
              const durationDays = Math.max(1, parseInt(booking.duration || 1, 10));

              for (let i = 0; i < durationDays; i++) {
                // Use consistent date formatting without timezone conversion
                const currentDay = startD + i;
                const currentDate = new Date(startY, startM, currentDay);
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const dateStr = `${year}-${month}-${day}`;

                console.log('Adding unavailable date for venue (consistent format):', venue.name, dateStr);

                if (!allUnavailableDates.includes(dateStr)) {
                  allUnavailableDates.push(dateStr);
                }

                bookedDatesDetails.push({
                  date: dateStr,
                  venue: booking.venue,
                  eventType: booking.eventType,
                  customer: booking.customer ? booking.customer.name : 'Unknown',
                  duration: durationDays,
                  isAdminBlock: booking.customer && booking.customer.name === 'Admin Block',
                  guests: booking.guests || 'N/A'
                });
              }
            }
          });

        // Remove duplicates from unavailable dates
        allUnavailableDates = [...new Set(allUnavailableDates)];
      } else {
        console.error('Failed to fetch bookings:', allBookingsResponse.status, allBookingsResponse.statusText);
      }

      console.log('Unavailable dates set:', allUnavailableDates);
      console.log('Booked dates details:', bookedDatesDetails);
      console.log('Final unavailable dates count:', allUnavailableDates.length);
      console.log('Final booked details count:', bookedDatesDetails.length);
      setUnavailableDates(allUnavailableDates);
      setBookedDatesWithDetails(bookedDatesDetails);
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
      setUnavailableDates([]);
      setBookedDatesWithDetails([]);
    }
  };

  const fetchVendorStallAvailability = async (date) => {
    if (!date) return;

    try {
      // For vendor stalls, get total availability (not date-specific)
      const response = await fetch(`${API_BASE_URL}/api/bookings/vendor-stalls/availability/${date}`);

      if (response.ok) {
        const data = await response.json();
        setVendorStallAvailability({
          totalStalls: data.totalStalls,
          availableStalls: data.availableStalls,
          rentedStalls: data.rentedStalls || data.bookedStalls // Handle both property names
        });
      } else {
        console.error('Failed to fetch vendor stall availability');
      }
    } catch (error) {
      console.error('Error fetching vendor stall availability:', error);
    }
  };

  const fetchBookedStalls = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/vendor-stalls/booked`);
      if (response.ok) {
        const data = await response.json();
        setBookedStalls(data.bookedStalls || []);
      }
    } catch (error) {
      console.error('Error fetching booked stalls:', error);
    }
  };

  const handleStallSelect = (block, stallNumber) => {
    const stallId = `${block}${stallNumber}`;
    if (bookedStalls.includes(stallId)) {
      showToast('This stall is already booked. Please select another stall.', { type: 'warning' });
      return;
    }
    setSelectedStall({ block, stallNumber, stallId });
    setShowStallSelector(false);
  };

  const renderStallGrid = () => {
    return (
      <div className="stall-grid-container">
        <h4>Select Your Vendor Stall</h4>
        <p className="stall-instruction">Click on an available stall to select it. Red stalls are already booked.</p>

        {Object.entries(stallBlocks).map(([blockLetter, blockInfo]) => (
          <div key={blockLetter} className="stall-block">
            <h5>{blockInfo.name} ({blockInfo.count} stalls)</h5>
            <div className="stall-grid">
              {Array.from({ length: blockInfo.count }, (_, index) => {
                const stallNumber = index + 1;
                const stallId = `${blockLetter}${stallNumber}`;
                const isBooked = bookedStalls.includes(stallId);
                const isSelected = selectedStall?.stallId === stallId;

                return (
                  <div
                    key={stallId}
                    className={`stall-box ${isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isBooked && handleStallSelect(blockLetter, stallNumber)}
                    title={isBooked ? 'Stall already booked' : `${blockLetter}${stallNumber} - Available`}
                  >
                    {blockLetter}{stallNumber}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const checkDateAvailability = async (date, venue) => {
    if (!date || !venue) return true;

    // Vendor stalls don't use date-based availability - they use stall-based availability
    if (venue === 'Vendor Stalls') {
      console.log('Skipping date availability check for vendor stalls');
      return true; // Always available for vendor stalls (stall availability is checked separately)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/availability/${encodeURIComponent(venue)}?startDate=${date}`);

      if (response.ok) {
        const data = await response.json();
        return data.isAvailable;
      }
      return true;
    } catch (error) {
      console.error('Error checking availability:', error);
      return true;
    } finally {
      // Availability check complete
    }
  };

  const venues = [
    {
      id: '1',
      name: 'Open Air Arena',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80',
      capacity: '8,00 chairs',
      description: 'A roofed arena perfect for musical shows, political gatherings, acoustic concerts, exhibitions/fairs, group meetings, and classes (karate/dance).',
      features: ['26 x 26 metal stage', '8,000 seating capacity', 'Changing room', 'Roofed structure', 'Electricity included', 'Ample parking space'],
      price: 'LKR 1,250,000 per day',
      usedFor: ['Musical shows', 'Political gatherings', 'Acoustic concerts', 'Exhibitions/fairs', 'Group meetings', 'Classes'],
      bookable: true
    },
    {
      id: '2',
      name: 'Open Area',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      capacity: 'Variable',
      description: 'An open outdoor space ideal for exhibitions and fairs with flexible arrangements.',
      features: ['Open outdoor space', 'Flexible layout', 'Exhibition ready', 'Fair hosting capability', 'Parking available'],
      price: 'LKR 150,000 per day',
      usedFor: ['Exhibitions', 'Fairs'],
      bookable: true
    },
    {
      id: '3',
      name: 'Vendor Stalls',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      capacity: '100 stalls available',
      description: 'Individual vendor stalls perfect for small businesses and market vendors.',
      features: ['6 x 4 feet per stall', '100 stalls total', 'Monthly rental basis', 'Individual electricity', 'Convenient parking access'],
      price: 'LKR 30,000 per month',
      usedFor: ['Small business', 'Market vendors', 'Retail shops'],
      bookable: true
    },
    {
      id: '4',
      name: 'Kids Park',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      capacity: 'Open for all',
      description: 'A free recreational area designed for children and families to enjoy various play activities.',
      features: ['Free of charge', 'Child-friendly equipment', 'Safe play area', 'Family recreational space', 'Free parking for families'],
      price: 'Free of charge',
      usedFor: ['Children recreation', 'Family activities', 'Play time'],
      bookable: false
    }
  ];

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });

    // Check date availability if date field is changed
    if (name === 'date' && value && selectedVenueForBooking) {
      const venue = venues.find(v => v.id === selectedVenueForBooking);
      if (venue) {
        // For vendor stalls, check total availability instead of date-specific
        if (selectedVenueForBooking === '3') {
          await fetchVendorStallAvailability(value);
          // Check if any stalls are available for rental
          const response = await fetch(`${API_BASE_URL}/api/bookings/vendor-stalls/availability/${value}`);
          if (response.ok) {
            const data = await response.json();
            if (!data.isAvailable) {
              showToast('No vendor stalls are available for rental. All 100 stalls are currently rented.', { type: 'warning' });
              setFormData(prev => ({ ...prev, date: '' }));
            }
          }
        } else {
          const isAvailable = await checkDateAvailability(value, venue.name);
          if (!isAvailable) {
            showToast('This date is not available. Please select a different date.', { type: 'warning' });
            // Clear the date field
            setFormData(prev => ({ ...prev, date: '' }));
          }
        }
      }
    }
  };

  const handleVenueSelect = (e) => {
    setSelectedVenueForBooking(e.target.value);
    // Clear date and selected stall when venue changes
    setFormData(prev => ({ ...prev, date: '' }));
    setSelectedStall(null);
  };

  // Calendar utility functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Removed unused formatDateForComparison function

  // Helper: format a Date to YYYY-MM-DD using local calendar values for UI comparisons
  const formatYmdLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateUnavailable = (date) => {
    // Format date as YYYY-MM-DD without timezone issues
    const dateStr = formatYmdLocal(date);
    const isUnavailable = unavailableDates.includes(dateStr);
    console.log(`Checking if ${dateStr} is unavailable:`, isUnavailable, 'Available dates:', unavailableDates);
    return isUnavailable;
  };

  const isDateAdminBlocked = (date) => {
    // Format date as YYYY-MM-DD without timezone issues
    const dateStr = formatYmdLocal(date);

    // Check if this date has an admin block
    const adminBlocked = bookedDatesWithDetails.some(booking =>
      booking.date === dateStr && booking.isAdminBlock
    );

    console.log(`Checking if ${dateStr} is admin blocked:`, adminBlocked);
    return adminBlocked;
  };

  // Function removed as it was unused - causing build failure in CI mode
  // const getBookingDetailsForDate = (date) => {
  //   // Format date as YYYY-MM-DD without timezone issues
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const dateStr = `${year}-${month}-${day}`;
  //   return bookedDatesWithDetails.filter(booking => booking.date === dateStr);
  // };

  const isDatePast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cmp = new Date(date);
    cmp.setHours(0, 0, 0, 0);
    return cmp < today;
  };

  const handleDateClick = (date) => {
    if (isDatePast(date) || isDateUnavailable(date) || isDateAdminBlocked(date)) {
      // Show appropriate message for different types of blocked dates
      if (isDateAdminBlocked(date)) {
        showToast('This date is blocked by admin for maintenance or special events. Please select a different date.', { type: 'info' });
      } else if (isDateUnavailable(date)) {
        showToast('This date is already booked. Please select a different date.', { type: 'warning' });
      }
      return; // Don't allow selection of past, unavailable, or admin-blocked dates
    }

    // Format date as YYYY-MM-DD without timezone issues (local)
    const dateStr = formatYmdLocal(date);

    setFormData(prev => ({ ...prev, date: dateStr }));
    setShowCalendar(false);

    // Check availability for vendor stalls
    if (selectedVenueForBooking === '3') {
      fetchVendorStallAvailability(dateStr);
    }
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isPast = isDatePast(date);
      const isUnavailable = isDateUnavailable(date);
      const isAdminBlocked = isDateAdminBlocked(date);
      // Format date consistently for comparison
      const dateStr = formatYmdLocal(date);
      const isSelected = formData.date === dateStr;

      // Debug logging for specific dates
      if (day <= 5) {
        console.log(`Day ${day}: isUnavailable=${isUnavailable}, isAdminBlocked=${isAdminBlocked}, unavailableDates=`, unavailableDates, `dateStr=${dateStr}`);
      }

      let className = 'calendar-day';
      if (isPast) className += ' past';
      if (isUnavailable) className += ' unavailable';
      if (isAdminBlocked) className += ' admin-blocked';
      if (isSelected) className += ' selected';
      if (!isPast && !isUnavailable && !isAdminBlocked) className += ' available';

      // Remove tooltip content for venue page - keep calendar clean for customers

      days.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDateClick(date)}
          title={
            isAdminBlocked ? 'Date not available' :
              isUnavailable ? 'Date not available' : ''
          }
        >
          {day}
          {isUnavailable && (
            <div className="booked-indicator-container">
              <span className="booked-indicator">Booked</span>
            </div>
          )}
          {isAdminBlocked && (
            <div className="admin-blocked-indicator-container">
              <span className="admin-blocked-indicator">Blocked</span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button type="button" onClick={() => navigateMonth('prev')} className="calendar-nav">
            ‹
          </button>
          <h3>{monthNames[currentMonth]} {currentYear}</h3>
          <button type="button" onClick={() => navigateMonth('next')} className="calendar-nav">
            ›
          </button>
        </div>
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-color unavailable"></span>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <span className="legend-color admin-blocked"></span>
            <span>Admin Blocked</span>
          </div>
          <div className="legend-item">
            <span className="legend-color past"></span>
            <span>Past</span>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const venue = venues.find(v => v.id === selectedVenueForBooking);

      if (!venue) {
        showToast('Please select a venue', { type: 'warning' });
        setIsSubmitting(false);
        return;
      }

      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.date) {
        showToast('Please fill in all required fields (Name, Email, Phone, Date)', { type: 'warning' });
        setIsSubmitting(false);
        return;
      }

      if (!isVendorStall && !formData.guests) {
        showToast('Please enter the expected number of guests', { type: 'warning' });
        setIsSubmitting(false);
        return;
      }

      if (isVendorStall && !selectedStall) {
        showToast('Please select a vendor stall', { type: 'warning' });
        setIsSubmitting(false);
        return;
      }

      // Map form data to API format
      const bookingData = {
        venue: venue.name,
        eventType: isVendorStall ? 'vendor stall rental' : (formData.eventType || 'other'),
        eventDate: formData.date,
        duration: isVendorStall ? 1 : getDurationInDays(formData.duration), // Vendor stalls are monthly, use 1 for duration
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        guests: parseInt(formData.guests) || 1,
        specialRequirements: formData.message || '',
        notes: isVendorStall
          ? `Vendor Stall Rental - ${selectedStall.stallId} (${stallBlocks[selectedStall.block].name}) - Monthly basis starting from ${formData.date}`
          : `Event Type: ${formData.eventType || 'other'}, Duration: ${formData.duration || 'Not specified'}`,
        // Add stall information for vendor stalls
        ...(isVendorStall && selectedStall && {
          stallInfo: {
            stallId: selectedStall.stallId,
            block: selectedStall.block,
            stallNumber: selectedStall.stallNumber,
            blockName: stallBlocks[selectedStall.block].name
          }
        })
      };

      console.log('Is Vendor Stall:', isVendorStall);
      console.log('Selected Venue ID:', selectedVenueForBooking);
      console.log('Venue Name:', venue.name);
      console.log('Submitting booking data:', bookingData);

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const savedBooking = await response.json();
        console.log('Booking saved:', savedBooking);
        const message = isVendorStall
          ? `Stall rental request submitted successfully! Booking ID: ${savedBooking._id}. We will contact you within 24 hours regarding your ${venue?.name} rental.`
          : `Booking request submitted successfully! Booking ID: ${savedBooking._id}. We will contact you within 24 hours regarding your ${venue?.name} booking.`;
        showToast(message, { type: 'success' });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          guests: '',
          message: '',
          eventType: '',
          duration: ''
        });
        setSelectedVenueForBooking('');
        setSelectedStall(null);
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData);
        showToast(`Booking failed: ${errorData.message || 'Please try again'}`, { type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      showToast('Connection error. Please check if the server is running and try again.', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert duration to days
  const getDurationInDays = (duration) => {
    switch (duration) {
      case 'half-day': return 1;
      case 'full-day': return 1;
      case 'multi-day': return 3; // Default to 3 days, can be customized
      default: return 1;
    }
  };

  const handleLearnMore = (venue) => {
    setSelectedVenue(venue);
  };

  const handleBookVenue = (venueId) => {
    setSelectedVenueForBooking(venueId);
    // Scroll to booking form
    setTimeout(() => {
      const bookingSection = document.getElementById('booking-form');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const closeModal = () => {
    setSelectedVenue(null);
  };

  // Check if selected venue is vendor stall
  const isVendorStall = selectedVenueForBooking === '3';

  return (
    <PageTransition>
      <div className="venues">
        {/* Hero Section */}
        <section className="venues-hero">
          <div className="hero-content">
            <FadeInUp delay={0.2}>
              <h1>Our Venues</h1>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <p>Discover the perfect space for your special event at Sahas Uyana</p>
            </FadeInUp>
          </div>
        </section>

        {/* Venues Grid */}
        <section className="venues-grid">
          <div className="container">
            <FadeInUp>
              <h2>Choose Your Perfect Venue</h2>
            </FadeInUp>
            <StaggerContainer>
              <div className="venues-list">
                {venues.map((venue, index) => (
                  <StaggerItem key={venue.id}>
                    <CardHover>
                      <div className="venue-card">
                        <div className="venue-image">
                          <img src={venue.image} alt={venue.name} />
                        </div>
                        <div className="venue-info">
                          <h3>{venue.name}</h3>
                          <p className="venue-capacity">{venue.capacity}</p>
                          {venue.id === '3' && (
                            <p className="available-stalls">
                              Available Stalls: {vendorStallAvailability.availableStalls} / {vendorStallAvailability.totalStalls}
                              <span className="rental-note"> (Long-term rentals available)</span>
                            </p>
                          )}
                          <p className="venue-description">{venue.description}</p>
                          <div className="venue-used-for">
                            <strong>Used for:</strong>
                            <ul>
                              {venue.usedFor.map((use, index) => (
                                <li key={index}>{use}</li>
                              ))}
                            </ul>
                          </div>
                          <p className="venue-price">{venue.price}</p>
                          <div className="venue-actions">
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleLearnMore(venue)}
                            >
                              Learn More
                            </button>
                            {venue.bookable ? (
                              <button
                                className="btn btn-primary"
                                onClick={() => handleBookVenue(venue.id)}
                              >
                                {venue.id === '3' ? 'Rent Stall' : 'Book Now'}
                              </button>
                            ) : (
                              <span className="free-venue">Free Access</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHover>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking-form" className="booking-section">
          <div className="container">
            <FadeInUp>
              <h2>Book Your Venue or Rent a Stall</h2>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="booking-container">
                <form className="booking-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="venue">Select Venue *</label>
                      <select
                        id="venue"
                        name="venue"
                        value={selectedVenueForBooking}
                        onChange={handleVenueSelect}
                        required
                      >
                        <option value="">Choose a venue...</option>
                        {venues
                          .filter(venue => venue.bookable)
                          .map((venue) => (
                            <option key={venue.id} value={venue.id}>
                              {venue.name} - {venue.price}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="date">{isVendorStall ? 'Start Date *' : 'Event Date *'}</label>
                      <div className="date-input-container">
                        <input
                          type="text"
                          id="date"
                          name="date"
                          value={formData.date ? (() => {
                            const [year, month, day] = formData.date.split('-');
                            return new Date(year, month - 1, day).toLocaleDateString();
                          })() : ''}
                          onClick={() => setShowCalendar(!showCalendar)}
                          placeholder="Click to select date"
                          readOnly
                          required
                          disabled={!selectedVenueForBooking}
                          className="calendar-input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCalendar(!showCalendar)}
                          className="calendar-toggle"
                          disabled={!selectedVenueForBooking}
                        >
                          📅
                        </button>
                      </div>
                      {selectedVenueForBooking === '3' && formData.date && (
                        <p className={`vendor-stall-availability ${vendorStallAvailability.availableStalls === 0 ? 'no-stalls' :
                            vendorStallAvailability.availableStalls <= 10 ? 'few-stalls' : 'available-stalls'
                          }`}>
                          <strong>Vendor Stalls Available for Rental:</strong> {vendorStallAvailability.availableStalls} out of {vendorStallAvailability.totalStalls}
                          {vendorStallAvailability.availableStalls === 0 && (
                            <span className="no-stalls-warning"> - All stalls are currently rented</span>
                          )}
                          {vendorStallAvailability.availableStalls > 0 && vendorStallAvailability.availableStalls <= 10 && (
                            <span className="few-stalls-warning"> - Limited availability!</span>
                          )}
                          <br />
                          <small>Note: Vendor stalls are long-term rentals, not daily bookings</small>
                        </p>
                      )}
                      {isVendorStall && (
                        <div className="form-group">
                          <label htmlFor="stallSelector">Select Vendor Stall *</label>
                          <div className="stall-selector-container">
                            <input
                              type="text"
                              id="stallSelector"
                              value={selectedStall ? `${selectedStall.stallId} (${stallBlocks[selectedStall.block].name})` : ''}
                              placeholder="Click to select a stall"
                              readOnly
                              onClick={() => setShowStallSelector(true)}
                              className="stall-selector-input"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowStallSelector(true)}
                              className="stall-selector-btn"
                            >
                              Choose Stall
                            </button>
                          </div>
                          {selectedStall && (
                            <p className="selected-stall-info">
                              Selected: <strong>{selectedStall.stallId}</strong> in {stallBlocks[selectedStall.block].name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {!isVendorStall && (
                      <div className="form-group">
                        <label htmlFor="guests">Expected Guests *</label>
                        <input
                          type="number"
                          id="guests"
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          required={!isVendorStall}
                        />
                      </div>
                    )}
                  </div>


                  {!isVendorStall && (
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="eventType">Event Type</label>
                        <select
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                        >
                          <option value="">Select event type...</option>
                          <option value="musical shows">Musical Shows</option>
                          <option value="accoustic concerts">Accoustic Concerts</option>
                          <option value="wedding">Wedding</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="birthday">Birthday Party</option>
                          <option value="anniversary">Anniversary</option>
                          <option value="classes">Classes</option>
                          <option value="political gatherings">Political Gatherings</option>
                          <option value="exhibitions">Exhibitions</option>
                          <option value="fairs">Fairs</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="duration">Event Duration</label>
                        <select
                          id="duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                        >
                          <option value="">Select duration...</option>
                          <option value="half-day">Half Day (4 hours)</option>
                          <option value="full-day">Full Day (8 hours)</option>
                          <option value="multi-day">Multiple Days</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="message">Additional Requirements</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={isVendorStall
                        ? "Please describe your business type, preferred stall location, and any special requirements..."
                        : "Please describe any special requirements, catering needs, or additional services..."
                      }
                    ></textarea>
                    {isVendorStall && (
                      <>
                        <p className="stall-note">
                          <strong>Note:</strong> {isVendorStall && formData.date ?
                            `${vendorStallAvailability.availableStalls} stalls are available for rental out of ${vendorStallAvailability.totalStalls} total stalls.` :
                            `Select a date to see current availability. Total of ${vendorStallAvailability.totalStalls} stalls available for rental.`
                          }
                        </p>
                        <p className="stall-note">
                          <strong>Long-term Rental:</strong> Vendor stalls are rented on an ongoing basis (monthly billing). Once rented, the stall remains with the tenant until they choose to vacate.
                        </p>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary submit-btn"
                    disabled={
                      isSubmitting ||
                      (isVendorStall && formData.date && vendorStallAvailability.availableStalls === 0)
                    }
                  >
                    {isSubmitting
                      ? (isVendorStall ? 'Submitting Rental Request...' : 'Submitting Booking Request...')
                      : (isVendorStall && formData.date && vendorStallAvailability.availableStalls === 0)
                        ? 'No Stalls Available'
                        : (isVendorStall ? 'Submit Rental Request' : 'Submit Booking Request')
                    }
                  </button>
                </form>

                {/* Calendar positioned next to the form */}
                {/* calendar popup moved beneath date input */}
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* Calendar Modal Popup */}
        {showCalendar && selectedVenueForBooking && (
          <div className="calendar-modal-overlay" onClick={() => setShowCalendar(false)}>
            <ScaleIn>
              <div className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="calendar-modal-header">
                  <h3>Select Date</h3>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    className="calendar-modal-close"
                  >
                    ×
                  </button>
                </div>
                <div className="calendar-modal-body">
                  {renderCalendar()}
                </div>
              </div>
            </ScaleIn>
          </div>
        )}

        {/* Stall Selector Modal */}
        {showStallSelector && (
          <div className="stall-modal-overlay" onClick={() => setShowStallSelector(false)}>
            <ScaleIn>
              <div className="stall-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="stall-modal-header">
                  <h3>Select Vendor Stall</h3>
                  <button
                    type="button"
                    onClick={() => setShowStallSelector(false)}
                    className="stall-modal-close"
                  >
                    ×
                  </button>
                </div>
                <div className="stall-modal-body">
                  {renderStallGrid()}
                </div>
              </div>
            </ScaleIn>
          </div>
        )}

        {/* Modal */}
        {selectedVenue && (
          <div className="modal-overlay" onClick={closeModal}>
            <ScaleIn>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>&times;</button>
                <img src={selectedVenue.image} alt={selectedVenue.name} className="modal-image" />
                <div className="modal-info">
                  <h3>{selectedVenue.name}</h3>
                  <p><strong>Capacity:</strong> {selectedVenue.capacity}</p>
                  <p><strong>Price:</strong> {selectedVenue.price}</p>
                  <p>{selectedVenue.description}</p>
                  <div className="features">
                    <h4>Features:</h4>
                    <ul>
                      {selectedVenue.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      closeModal();
                      handleBookVenue(selectedVenue.id);
                    }}
                  >
                    Book This Venue
                  </button>
                </div>
              </div>
            </ScaleIn>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default Venues;