const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['car', 'guest', 'host'],
    required: true
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ car: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ reviewer: 1 });

// Update car rating when review is saved
reviewSchema.post('save', async function() {
  if (this.type === 'car' && this.car) {
    const Review = mongoose.model('Review');
    const Car = mongoose.model('Car');
    
    const stats = await Review.aggregate([
      { $match: { car: this.car, type: 'car' } },
      {
        $group: {
          _id: '$car',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Car.findByIdAndUpdate(this.car, {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews
      });
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);