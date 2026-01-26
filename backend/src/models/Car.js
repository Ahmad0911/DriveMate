const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  transmission: {
    type: String,
    enum: ['automatic', 'manual'],
    default: 'automatic'
  },
  fuelType: {
    type: String,
    enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
    default: 'gasoline'
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  doors: {
    type: Number,
    min: 2,
    max: 5
  },
  features: [{
    type: String,
    trim: true
  }],
  dailyPrice: {
    type: Number,
    required: true,
    min: 1
  },
  weeklyDiscount: {
    type: Number,
    default: 0.1,
    min: 0,
    max: 1
  },
  monthlyDiscount: {
    type: Number,
    default: 0.15,
    min: 0,
    max: 1
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  instantBook: {
    type: Boolean,
    default: false
  },
  minimumRentDays: {
    type: Number,
    default: 1,
    min: 1
  },
  maximumRentDays: {
    type: Number,
    default: 30,
    min: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
carSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'car'
});

// Indexes for faster queries
carSchema.index({ location: 'text', make: 'text', model: 'text' });
carSchema.index({ dailyPrice: 1 });
carSchema.index({ isAvailable: 1 });
carSchema.index({ host: 1 });

module.exports = mongoose.model('Car', carSchema);