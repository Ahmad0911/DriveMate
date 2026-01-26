const Booking = require('../models/Booking');
const Car = require('../models/Car');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.calculatePrice = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.query;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (totalDays < car.minimumRentDays) {
      return res.status(400).json({
        error: `Minimum rental period is ${car.minimumRentDays} days`
      });
    }

    if (totalDays > car.maximumRentDays) {
      return res.status(400).json({
        error: `Maximum rental period is ${car.maximumRentDays} days`
      });
    }

    // Calculate base price
    let basePrice = car.dailyPrice * totalDays;

    // Apply discounts
    if (totalDays >= 30 && car.monthlyDiscount) {
      basePrice *= (1 - car.monthlyDiscount);
    } else if (totalDays >= 7 && car.weeklyDiscount) {
      basePrice *= (1 - car.weeklyDiscount);
    }

    const serviceFee = basePrice * 0.15;
    const totalAmount = basePrice + serviceFee;
    const hostEarning = basePrice;

    res.json({
      success: true,
      calculation: {
        totalDays,
        dailyRate: car.dailyPrice,
        basePrice: parseFloat(basePrice.toFixed(2)),
        serviceFee: parseFloat(serviceFee.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        hostEarning: parseFloat(hostEarning.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const {
      carId,
      startDate,
      endDate,
      pickUpLocation,
      dropOffLocation,
      specialRequests
    } = req.body;

    // Check availability
    const existingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Car is not available for selected dates' });
    }

    // Get car and calculate price
    const car = await Car.findById(carId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let basePrice = car.dailyPrice * totalDays;
    if (totalDays >= 30 && car.monthlyDiscount) {
      basePrice *= (1 - car.monthlyDiscount);
    } else if (totalDays >= 7 && car.weeklyDiscount) {
      basePrice *= (1 - car.weeklyDiscount);
    }

    const serviceFee = basePrice * 0.15;
    const totalAmount = basePrice + serviceFee;
    const hostEarning = basePrice;

    // Create booking
    const booking = await Booking.create({
      car: carId,
      user: req.user.id,
      startDate,
      endDate,
      totalDays,
      dailyRate: car.dailyPrice,
      totalAmount,
      serviceFee,
      hostEarning,
      pickUpLocation,
      dropOffLocation,
      specialRequests,
      status: car.instantBook ? 'confirmed' : 'pending'
    });

    // Create Stripe session for payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${car.make} ${car.model} Rental`,
            description: `${startDate} to ${endDate} (${totalDays} days)`
          },
          unit_amount: Math.round(totalAmount * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/cancel`,
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id
      }
    });

    // Update booking with session ID
    booking.stripeSessionId = session.id;
    await booking.save();

    res.json({
      success: true,
      booking,
      sessionId: session.id,
      sessionUrl: session.url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('car', 'make model year images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHostBookings = async (req, res) => {
  try {
    // Find cars owned by host
    const cars = await Car.find({ host: req.user.id }).select('_id');
    const carIds = cars.map(car => car._id);

    const bookings = await Booking.find({ car: { $in: carIds } })
      .populate('car', 'make model year')
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};