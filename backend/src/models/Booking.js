const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    required: true,
    min: 1
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 1
  },
  serviceFee: {
    type: Number,
    required: true,
    min: 0
  },
  hostEarning: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
    default: ''
  },
  stripeSessionId: {
    type: String,
    default: ''
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  pickUpLocation: {
    type: String,
    trim: true
  },
  dropOffLocation: {
    type: String,
    trim: true
  },
  specialRequests: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Validate dates
bookingSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ car: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);