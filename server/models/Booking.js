const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  venue: {
    type: String,
    required: true,
    enum: ['Open Air Arena', 'Open Area', 'Vendor Stalls', 'Kids Park']
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'musical shows',
      'accoustic concerts',
      'wedding',
      'corporate',
      'birthday',
      'anniversary',
      'classes',
      'political gatherings',
      'exhibitions',
      'fairs',
      'vendor stall rental',
      'other'
    ]
  },
  eventDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequirements: {
    type: String,
    maxlength: 500
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  stallInfo: {
    stallId: {
      type: String,
      required: function() {
        return this.venue === 'Vendor Stalls';
      }
    },
    block: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
      required: function() {
        return this.venue === 'Vendor Stalls';
      }
    },
    stallNumber: {
      type: Number,
      min: 1,
      required: function() {
        return this.venue === 'Vendor Stalls';
      }
    },
    blockName: {
      type: String,
      required: function() {
        return this.venue === 'Vendor Stalls';
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
bookingSchema.index({ eventDate: 1, venue: 1 });
bookingSchema.index({ 'customer.email': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'stallInfo.stallId': 1 });
bookingSchema.index({ venue: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
