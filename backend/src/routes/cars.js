const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { authenticate, authorizeHost } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

// Public routes
router.get('/', carController.searchCars);
router.get('/:id', carController.getCar);

// Protected routes
router.use(authenticate);

router.post('/', authorizeHost, carController.createCar);
router.get('/my/list', authorizeHost, carController.getMyCars);
router.put('/:id', authorizeHost, carController.updateCar);
router.post('/:carId/images', authorizeHost, uploadMultiple, carController.uploadCarImages);
router.post('/:carId/favorite', carController.toggleFavorite);

module.exports = router;