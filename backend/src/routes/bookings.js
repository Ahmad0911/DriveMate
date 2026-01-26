const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorizeHost } = require('../middleware/auth');

router.use(authenticate);

router.get('/calculate-price', bookingController.calculatePrice);
router.post('/', bookingController.createBooking);
router.get('/my', bookingController.getMyBookings);
router.get('/host', authorizeHost, bookingController.getHostBookings);

module.exports = router;