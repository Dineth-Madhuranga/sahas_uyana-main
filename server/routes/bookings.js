const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const emailService = require('../services/emailService');
const adminEmailService = require('../services/adminEmailService');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token for admin routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get all bookings (exclude vendor stalls from calendar view)
router.get('/', async (req, res) => {
  try {
    const { status, venue, page = 1, limit = 10, excludeVendorStalls = false } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (venue) query.venue = venue;
    
    // Exclude vendor stalls for calendar views
    if (excludeVendorStalls === 'true') {
      query.venue = { $ne: 'Vendor Stalls' };
    }
    
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Booking.countDocuments(query);
    
    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Check venue availability for date range
router.get('/availability/:venue', async (req, res) => {
  try {
    const { venue } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate) {
      return res.status(400).json({ message: 'Start date is required' });
    }
    
    // Default end date to start date if not provided
    const queryEndDate = endDate || startDate;
    
    // Special handling for Vendor Stalls - ongoing rentals, not daily
    if (venue === 'Vendor Stalls') {
      // Count total confirmed vendor stall rentals (active rentals)
      const totalRentedStalls = await Booking.countDocuments({
        venue: 'Vendor Stalls',
        status: 'confirmed'
        // No date filter - once rented, stall is occupied until tenant vacates
      });
      
      const totalStalls = 100;
      const availableStalls = totalStalls - totalRentedStalls;
      const isAvailable = availableStalls > 0;
      
      return res.json({
        venue,
        startDate,
        endDate: queryEndDate,
        isAvailable,
        totalStalls,
        rentedStalls: totalRentedStalls,
        availableStalls,
        isVendorStall: true,
        note: 'Vendor stalls are long-term rentals, not daily bookings'
      });
    }
    
    // Regular logic for other venues (excluding vendor stalls)
    // Find confirmed bookings that overlap with the requested date range
    const overlappingBookings = await Booking.find({
      venue: venue,
      status: 'confirmed',
      $or: [
        {
          // Booking starts before or on requested start and ends after requested start
          eventDate: { $lte: new Date(startDate) },
          $expr: {
            $gte: [
              { $dateAdd: { startDate: '$eventDate', unit: 'day', amount: '$duration' } },
              new Date(startDate)
            ]
          }
        },
        {
          // Booking starts within the requested range
          eventDate: {
            $gte: new Date(startDate),
            $lte: new Date(queryEndDate)
          }
        }
      ]
    });
    
    const isAvailable = overlappingBookings.length === 0;
    
    res.json({
      venue,
      startDate,
      endDate: queryEndDate,
      isAvailable,
      conflictingBookings: overlappingBookings.map(booking => ({
        id: booking._id,
        eventDate: booking.eventDate,
        duration: booking.duration,
        eventType: booking.eventType,
        customer: booking.customer.name
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking availability', error: error.message });
  }
});

// Get unavailable dates for a venue
router.get('/unavailable-dates/:venue', async (req, res) => {
  try {
    const { venue } = req.params;
    const { month, year } = req.query;
    
    // Build date range for the query (default to current month if not specified)
    const currentDate = new Date();
    const queryYear = year ? parseInt(year) : currentDate.getFullYear();
    const queryMonth = month ? parseInt(month) - 1 : currentDate.getMonth(); // Month is 0-indexed
    
    const startOfMonth = new Date(queryYear, queryMonth, 1);
    const endOfMonth = new Date(queryYear, queryMonth + 1, 0);
    
    // Special handling for Vendor Stalls - ongoing rentals
    if (venue === 'Vendor Stalls') {
      // Vendor stalls don't have "unavailable dates" since they are ongoing rentals
      // Once rented, they stay rented until the tenant vacates
      // Return empty unavailable dates array
      return res.json({
        venue,
        month: queryMonth + 1,
        year: queryYear,
        unavailableDates: [], // No specific dates are unavailable
        isVendorStall: true,
        note: 'Vendor stalls are ongoing rentals, not date-specific bookings'
      });
    }
    
    // Regular logic for other venues (excluding vendor stalls)
    // Find all confirmed bookings for this venue in the specified month
    const confirmedBookings = await Booking.find({
      venue: venue,
      status: 'confirmed',
      eventDate: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });
    
    // Generate array of unavailable dates using consistent date formatting
    const unavailableDates = [];
    confirmedBookings.forEach(booking => {
      const startDate = new Date(booking.eventDate);
      for (let i = 0; i < booking.duration; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        // Use consistent date formatting without timezone conversion
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        unavailableDates.push(dateString);
      }
    });
    
    res.json({
      venue,
      month: queryMonth + 1,
      year: queryYear,
      unavailableDates: [...new Set(unavailableDates)] // Remove duplicates
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unavailable dates', error: error.message });
  }
});

// Get vendor stall availability for specific date
router.get('/vendor-stalls/availability/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // For vendor stalls, we only check total rented stalls (active rentals)
    // Not date-specific since they are ongoing monthly rentals
    const totalRentedStalls = await Booking.countDocuments({
      venue: 'Vendor Stalls',
      status: 'confirmed'
      // No date filter - if confirmed, the stall is rented until removed
    });
    
    const totalStalls = 100;
    const availableStalls = totalStalls - totalRentedStalls;
    
    res.json({
      date: date,
      totalStalls,
      rentedStalls: totalRentedStalls,
      availableStalls,
      isAvailable: availableStalls > 0,
      note: 'Vendor stalls are long-term rentals, not daily bookings'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor stall availability', error: error.message });
  }
});

// Get booked vendor stalls
router.get('/vendor-stalls/booked', async (req, res) => {
  try {
    const bookedStalls = await Booking.find({
      venue: 'Vendor Stalls',
      status: 'confirmed',
      'stallInfo.stallId': { $exists: true }
    }).select('stallInfo');
    
    const stallIds = bookedStalls.map(booking => booking.stallInfo?.stallId).filter(Boolean);
    
    res.json({
      bookedStalls: stallIds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booked stalls', error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
});

// Test endpoint without authentication
router.post('/admin-block-test', async (req, res) => {
  console.log('Test endpoint hit - no auth required');
  res.json({ message: 'Test endpoint working', body: req.body });
});

// Admin block date endpoint
router.post('/admin-block', authenticateToken, async (req, res) => {
  try {
    console.log('Received admin block request:', req.body);
    
    const {
      venue,
      eventType,
      eventDate,
      duration,
      notes,
      customer,
      guests,
      status,
      totalAmount
    } = req.body;
    
    // Validate required fields for admin block
    if (!venue || !eventType || !eventDate || !customer) {
      console.log('Admin block validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields for admin block',
        required: ['venue', 'eventType', 'eventDate', 'customer']
      });
    }
    
    console.log('Creating admin block booking with data:', {
      venue,
      eventType,
      eventDate,
      duration: duration || 1,
      customer,
      guests: guests || 1,
      status: 'confirmed',
      totalAmount: 0
    });
    
    const booking = new Booking({
      venue,
      eventType,
      eventDate: new Date(eventDate),
      duration: duration || 1,
      customer,
      guests: guests || 1,
      totalAmount: 0, // Admin blocks are free
      specialRequirements: '',
      notes: notes || 'Admin blocked date',
      status: 'confirmed' // Admin blocks are automatically confirmed
    });
    
    const savedBooking = await booking.save();
    console.log('Admin block booking saved successfully:', savedBooking._id);
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating admin block booking:', error);
    res.status(400).json({ message: 'Error creating admin block booking', error: error.message });
  }
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', req.body);
    
    const {
      venue,
      eventType,
      eventDate,
      duration,
      customer,
      guests,
      specialRequirements,
      notes
    } = req.body;
    
    // Validate required fields
    if (!venue || !eventType || !eventDate || !duration || !customer || !guests) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['venue', 'eventType', 'eventDate', 'duration', 'customer', 'guests']
      });
    }
    
    if (!customer.name || !customer.email || !customer.phone) {
      console.log('Validation failed - missing customer information');
      return res.status(400).json({ 
        message: 'Missing customer information (name, email, phone required)'
      });
    }
    
    // Special validation for vendor stalls - check specific stall availability
    if (venue === 'Vendor Stalls') {
      const { stallInfo } = req.body;
      
      if (!stallInfo || !stallInfo.stallId) {
        return res.status(400).json({ 
          message: 'Stall information is required for vendor stall bookings'
        });
      }
      
      // Check if the specific stall is already booked
      const existingStallBooking = await Booking.findOne({
        venue: 'Vendor Stalls',
        status: 'confirmed',
        'stallInfo.stallId': stallInfo.stallId
      });
      
      if (existingStallBooking) {
        console.log(`Vendor stall ${stallInfo.stallId} is already booked`);
        return res.status(400).json({ 
          message: `Stall ${stallInfo.stallId} is already booked. Please select another stall.`,
          bookedStall: stallInfo.stallId
        });
      }
      
      console.log(`Vendor stall ${stallInfo.stallId} is available for booking`);
    }
    
    // Calculate total amount based on venue
    let totalAmount = 0;
    if (venue === 'Open Air Arena') {
      totalAmount = 1250000 * duration;
    } else if (venue === 'Open Area') {
      totalAmount = 150000 * duration;
    } else if (venue === 'Vendor Stalls') {
      totalAmount = 30000; // Monthly rental
    } else if (venue === 'Kids Park') {
      totalAmount = 0; // Free
    }
    
    console.log('Creating booking with total amount:', totalAmount);
    
    const booking = new Booking({
      venue,
      eventType,
      eventDate: new Date(eventDate),
      duration,
      customer,
      guests,
      totalAmount,
      specialRequirements,
      notes,
      // Include stall information if it's a vendor stall booking
      ...(venue === 'Vendor Stalls' && req.body.stallInfo && {
        stallInfo: req.body.stallInfo
      })
    });
    
    const savedBooking = await booking.save();
    console.log('Booking saved successfully:', savedBooking._id);
    
    // Send submission confirmation email to customer
    try {
      await emailService.sendBookingSubmission(savedBooking);
      console.log('Customer submission email sent successfully');
    } catch (emailError) {
      console.error('Failed to send customer submission email:', emailError);
      // Don't fail the booking if email fails
    }

    // Send notification email to admin
    try {
      await adminEmailService.sendBookingNotificationToAdmin(savedBooking);
      console.log('Admin notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the booking if email fails
    }
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Send email notifications based on status change
    try {
      if (status === 'confirmed') {
        await emailService.sendBookingConfirmation(booking);
        console.log('Confirmation email sent for booking:', booking._id);
      } else if (status === 'cancelled') {
        await emailService.sendBookingRejection(booking, rejectionReason);
        console.log('Rejection email sent for booking:', booking._id);
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the status update if email fails
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const {
      venue,
      eventType,
      eventDate,
      duration,
      customer,
      guests,
      specialRequirements,
      notes
    } = req.body;
    
    // Calculate total amount based on venue
    let totalAmount = 0;
    if (venue === 'Open Air Arena') {
      totalAmount = 1250000 * duration;
    } else if (venue === 'Open Area') {
      totalAmount = 150000 * duration;
    } else if (venue === 'Vendor Stalls') {
      totalAmount = 30000; // Monthly rental
    } else if (venue === 'Kids Park') {
      totalAmount = 0; // Free
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        venue,
        eventType,
        eventDate: new Date(eventDate),
        duration,
        customer,
        guests,
        totalAmount,
        specialRequirements,
        notes
      },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

// Get booking statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const venueStats = await Booking.aggregate([
      { $group: { _id: '$venue', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      totalBookings,
      confirmedBookings,
      pendingBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      venueStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking statistics', error: error.message });
  }
});

// Admin endpoint to get vendor stall overview
router.get('/admin/vendor-stalls', authenticateToken, async (req, res) => {
  console.log('Admin vendor stalls endpoint called');
  console.log('User from token:', req.user);
  try {
    // Get all confirmed vendor stall bookings
    const stallBookings = await Booking.find({
      venue: 'Vendor Stalls',
      status: 'confirmed'
    }).select('stallInfo customer eventDate notes createdAt').sort({ 'stallInfo.stallId': 1 });

    // Create stall blocks structure
    const stallBlocks = {
      A: { count: 16, name: 'Block A', stalls: [] },
      B: { count: 24, name: 'Block B', stalls: [] },
      C: { count: 20, name: 'Block C', stalls: [] },
      D: { count: 16, name: 'Block D', stalls: [] },
      E: { count: 12, name: 'Block E', stalls: [] },
      F: { count: 12, name: 'Block F', stalls: [] }
    };

    // Initialize all stalls as available
    Object.keys(stallBlocks).forEach(block => {
      for (let i = 1; i <= stallBlocks[block].count; i++) {
        stallBlocks[block].stalls.push({
          stallId: `${block}${i}`,
          stallNumber: i,
          status: 'available',
          booking: null
        });
      }
    });

    // Mark booked stalls
    stallBookings.forEach(booking => {
      if (booking.stallInfo && booking.stallInfo.block && booking.stallInfo.stallNumber) {
        const block = booking.stallInfo.block;
        const stallNumber = booking.stallInfo.stallNumber;
        const stallIndex = stallNumber - 1;
        
        if (stallBlocks[block] && stallBlocks[block].stalls[stallIndex]) {
          stallBlocks[block].stalls[stallIndex] = {
            stallId: booking.stallInfo.stallId,
            stallNumber: stallNumber,
            status: 'booked',
            booking: {
              id: booking._id,
              customerName: booking.customer.name,
              customerEmail: booking.customer.email,
              customerPhone: booking.customer.phone,
              startDate: booking.eventDate,
              notes: booking.notes,
              createdAt: booking.createdAt
            }
          };
        }
      }
    });

    // Calculate statistics
    const totalStalls = Object.values(stallBlocks).reduce((sum, block) => sum + block.count, 0);
    const bookedStalls = stallBookings.length;
    const availableStalls = totalStalls - bookedStalls;

    res.json({
      stallBlocks,
      statistics: {
        totalStalls,
        bookedStalls,
        availableStalls,
        occupancyRate: ((bookedStalls / totalStalls) * 100).toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor stall data', error: error.message });
  }
});

// Admin endpoint to book a vendor stall directly
router.post('/admin/vendor-stalls/book', authenticateToken, async (req, res) => {
  try {
    const { stallInfo, customer, notes } = req.body;

    if (!stallInfo || !stallInfo.stallId || !customer) {
      return res.status(400).json({ message: 'Stall information and customer details are required' });
    }

    // Check if stall is already booked
    const existingBooking = await Booking.findOne({
      venue: 'Vendor Stalls',
      status: 'confirmed',
      'stallInfo.stallId': stallInfo.stallId
    });

    if (existingBooking) {
      return res.status(400).json({ 
        message: `Stall ${stallInfo.stallId} is already booked`,
        bookedStall: stallInfo.stallId
      });
    }

    // Create admin booking
    const booking = new Booking({
      venue: 'Vendor Stalls',
      eventType: 'vendor stall rental',
      eventDate: new Date(),
      duration: 1,
      customer,
      guests: 1,
      totalAmount: 30000,
      specialRequirements: '',
      notes: notes || `Admin booked stall ${stallInfo.stallId}`,
      status: 'confirmed', // Admin bookings are automatically confirmed
      stallInfo
    });

    const savedBooking = await booking.save();
    
    res.json({
      message: `Stall ${stallInfo.stallId} booked successfully`,
      booking: savedBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking vendor stall', error: error.message });
  }
});

// Temporary test endpoint without authentication for debugging
router.get('/vendor-stalls/test', async (req, res) => {
  console.log('Test vendor stalls endpoint called');
  try {
    // Get all confirmed vendor stall bookings
    const stallBookings = await Booking.find({
      venue: 'Vendor Stalls',
      status: 'confirmed'
    }).select('stallInfo customer eventDate notes createdAt').sort({ 'stallInfo.stallId': 1 });

    console.log('Found stall bookings:', stallBookings.length);

    // Create stall blocks structure
    const stallBlocks = {
      A: { count: 16, name: 'Block A', stalls: [] },
      B: { count: 24, name: 'Block B', stalls: [] },
      C: { count: 20, name: 'Block C', stalls: [] },
      D: { count: 16, name: 'Block D', stalls: [] },
      E: { count: 12, name: 'Block E', stalls: [] },
      F: { count: 12, name: 'Block F', stalls: [] }
    };

    // Initialize all stalls as available
    Object.keys(stallBlocks).forEach(block => {
      for (let i = 1; i <= stallBlocks[block].count; i++) {
        stallBlocks[block].stalls.push({
          stallId: `${block}${i}`,
          stallNumber: i,
          status: 'available',
          booking: null
        });
      }
    });

    // Mark booked stalls
    stallBookings.forEach(booking => {
      if (booking.stallInfo && booking.stallInfo.block && booking.stallInfo.stallNumber) {
        const block = booking.stallInfo.block;
        const stallNumber = booking.stallInfo.stallNumber;
        const stallIndex = stallNumber - 1;
        
        if (stallBlocks[block] && stallBlocks[block].stalls[stallIndex]) {
          stallBlocks[block].stalls[stallIndex] = {
            stallId: booking.stallInfo.stallId,
            stallNumber: stallNumber,
            status: 'booked',
            booking: {
              id: booking._id,
              customerName: booking.customer.name,
              customerEmail: booking.customer.email,
              customerPhone: booking.customer.phone,
              startDate: booking.eventDate,
              notes: booking.notes,
              createdAt: booking.createdAt
            }
          };
        }
      }
    });

    // Calculate statistics
    const totalStalls = Object.values(stallBlocks).reduce((sum, block) => sum + block.count, 0);
    const bookedStalls = stallBookings.length;
    const availableStalls = totalStalls - bookedStalls;

    const result = {
      stallBlocks,
      statistics: {
        totalStalls,
        bookedStalls,
        availableStalls,
        occupancyRate: ((bookedStalls / totalStalls) * 100).toFixed(1)
      }
    };

    console.log('Returning stall data:', {
      totalStalls,
      bookedStalls,
      availableStalls
    });

    res.json(result);
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ message: 'Error fetching vendor stall data', error: error.message });
  }
});

module.exports = router;
