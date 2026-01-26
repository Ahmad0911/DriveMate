const Car = require('../models/Car');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Escape special regex characters to prevent ReDoS attacks
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// POST /api/cars/list (Create a new car listing)
exports.createCar = async (req, res) => {
  try {
    // Check if user is a host
    if (!req.user.isHost) {
      return res.status(403).json({ 
        error: 'Only verified hosts can list cars. Please apply to become a host first.' 
      });
    }

    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'dailyPrice', 'location', 'transmission', 'fuelType', 'seats'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate numeric fields
    if (req.body.year < 1900 || req.body.year > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    if (req.body.dailyPrice < 0) {
      return res.status(400).json({ error: 'Daily price must be positive' });
    }

    if (req.body.seats < 1 || req.body.seats > 15) {
      return res.status(400).json({ error: 'Seats must be between 1 and 15' });
    }

    // Create car data
    const carData = {
      ...req.body,
      host: req.user.id,
      isAvailable: true
    };

    const car = await Car.create(carData);

    res.status(201).json({
      success: true,
      message: 'Car listed successfully',
      car
    });
  } catch (error) {
    console.error('Create car error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to create car listing' });
  }
};

// POST /api/cars/:id/images (Upload car images)
exports.uploadCarImages = async (req, res) => {
  try {
    const { id: carId } = req.params;

    // Validate car ID
    if (!isValidObjectId(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    // Verify car belongs to user
    const car = await Car.findOne({ _id: carId, host: req.user.id });
    
    if (!car) {
      return res.status(404).json({ 
        error: 'Car not found or you do not have permission to modify it' 
      });
    }

    // Check if images provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    // Limit number of images
    const currentImageCount = car.images?.length || 0;
    const newImageCount = req.files.length;
    const maxImages = 10;

    if (currentImageCount + newImageCount > maxImages) {
      return res.status(400).json({ 
        error: `Maximum ${maxImages} images allowed. You currently have ${currentImageCount} images.` 
      });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(async (file, index) => {
      try {
        const result = await uploadToCloudinary(file.path, `cars/${carId}`);
        return {
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary: currentImageCount === 0 && index === 0 // First image is primary if no images exist
        };
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        throw new Error(`Failed to upload image ${index + 1}`);
      }
    });

    const images = await Promise.all(uploadPromises);

    // Update car with images
    car.images = car.images || [];
    car.images.push(...images);
    await car.save();

    res.json({
      success: true,
      message: `${images.length} image(s) uploaded successfully`,
      images,
      car
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload images' });
  }
};

// GET /api/cars/:id (Get single car)
exports.getCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate car ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    const car = await Car.findById(id)
      .populate('host', 'firstName lastName avatar rating totalReviews isVerified')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          select: 'firstName lastName avatar'
        },
        options: { limit: 10, sort: { createdAt: -1 } }
      });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Increment view count
    car.views = (car.views || 0) + 1;
    await car.save();

    res.json({
      success: true,
      car
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ error: 'Failed to fetch car details' });
  }
};

// GET /api/cars (Search and filter cars)
exports.searchCars = async (req, res) => {
  try {
    const {
      location,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      carType,
      make,
      transmission,
      fuelType,
      seats,
      instantBook,
      features,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isAvailable: true };

    // Location search (with regex escape)
    if (location) {
      const escapedLocation = escapeRegex(location.trim());
      query.location = { $regex: escapedLocation, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.dailyPrice = {};
      if (minPrice) {
        const min = Number(minPrice);
        if (isNaN(min) || min < 0) {
          return res.status(400).json({ error: 'Invalid minimum price' });
        }
        query.dailyPrice.$gte = min;
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        if (isNaN(max) || max < 0) {
          return res.status(400).json({ error: 'Invalid maximum price' });
        }
        query.dailyPrice.$lte = max;
      }
    }

    // Car type search (make or model)
    if (carType) {
      const escapedCarType = escapeRegex(carType.trim());
      query.$or = [
        { make: { $regex: escapedCarType, $options: 'i' } },
        { model: { $regex: escapedCarType, $options: 'i' } }
      ];
    }

    // Specific make filter
    if (make) {
      const escapedMake = escapeRegex(make.trim());
      query.make = { $regex: escapedMake, $options: 'i' };
    }

    // Other filters
    if (transmission && ['automatic', 'manual'].includes(transmission.toLowerCase())) {
      query.transmission = transmission.toLowerCase();
    }

    if (fuelType && ['petrol', 'diesel', 'electric', 'hybrid'].includes(fuelType.toLowerCase())) {
      query.fuelType = fuelType.toLowerCase();
    }

    if (seats) {
      const seatCount = Number(seats);
      if (!isNaN(seatCount) && seatCount > 0) {
        query.seats = { $gte: seatCount };
      }
    }

    if (instantBook === 'true') {
      query.instantBook = true;
    }

    // Features filter (array of features)
    if (features) {
      const featureList = Array.isArray(features) ? features : [features];
      query.features = { $all: featureList };
    }

    // Date availability check
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Validate dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      if (start >= end) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      if (start < new Date()) {
        return res.status(400).json({ error: 'Start date cannot be in the past' });
      }

      // Find cars that have conflicting bookings
      const conflictingBookings = await Booking.find({
        status: { $in: ['confirmed', 'active'] },
        startDate: { $lte: end },
        endDate: { $gte: start }
      }).select('car').lean();

      const bookedCarIds = conflictingBookings.map(b => b.car.toString());
      query._id = { $nin: bookedCarIds };
    }

    // Sorting
    const allowedSortFields = ['createdAt', 'dailyPrice', 'rating', 'views'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sort = {};
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit))); // Max 50 per page
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [cars, total] = await Promise.all([
      Car.find(query)
        .populate('host', 'firstName lastName avatar rating totalReviews')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Car.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: cars.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      cars
    });
  } catch (error) {
    console.error('Search cars error:', error);
    res.status(500).json({ error: 'Failed to search cars' });
  }
};

// GET /api/cars/user/:userId (Get user's cars / My cars)
exports.getUserCars = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Check if requesting own cars or another user's cars
    const isOwnCars = userId === req.user.id;

    const query = { host: userId };

    // If viewing another user's cars, only show available ones
    if (!isOwnCars) {
      query.isAvailable = true;
    }

    const cars = await Car.find(query)
      .populate('host', 'firstName lastName avatar rating')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: cars.length,
      cars
    });
  } catch (error) {
    console.error('Get user cars error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

// GET /api/cars/my/listings (Get my car listings - alternative endpoint)
exports.getMyCars = async (req, res) => {
  try {
    if (!req.user.isHost) {
      return res.status(403).json({ error: 'Only hosts can view their listings' });
    }

    const cars = await Car.find({ host: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: cars.length,
      cars
    });
  } catch (error) {
    console.error('Get my cars error:', error);
    res.status(500).json({ error: 'Failed to fetch your cars' });
  }
};

// PUT /api/cars/:id (Update car)
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate car ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    // Find car and verify ownership
    const car = await Car.findOne({
      _id: id,
      host: req.user.id
    });

    if (!car) {
      return res.status(404).json({ 
        error: 'Car not found or you do not have permission to modify it' 
      });
    }

    // Prevent updating certain protected fields
    const protectedFields = ['host', '_id', 'createdAt', 'reviews'];
    protectedFields.forEach(field => delete req.body[field]);

    // Validate numeric fields if being updated
    if (req.body.year && (req.body.year < 1900 || req.body.year > new Date().getFullYear() + 1)) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    if (req.body.dailyPrice !== undefined && req.body.dailyPrice < 0) {
      return res.status(400).json({ error: 'Daily price must be positive' });
    }

    if (req.body.seats && (req.body.seats < 1 || req.body.seats > 15)) {
      return res.status(400).json({ error: 'Seats must be between 1 and 15' });
    }

    // Update car
    Object.assign(car, req.body);
    car.updatedAt = new Date();
    await car.save();

    res.json({
      success: true,
      message: 'Car updated successfully',
      car
    });
  } catch (error) {
    console.error('Update car error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ error: 'Failed to update car' });
  }
};

// DELETE /api/cars/:id (Delete car)
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate car ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    // Find car and verify ownership
    const car = await Car.findOne({
      _id: id,
      host: req.user.id
    });

    if (!car) {
      return res.status(404).json({ 
        error: 'Car not found or you do not have permission to delete it' 
      });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      car: id,
      status: { $in: ['confirmed', 'active'] },
      endDate: { $gte: new Date() }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete car with active or upcoming bookings' 
      });
    }

    // Delete images from Cloudinary
    if (car.images && car.images.length > 0) {
      const deletePromises = car.images.map(img => 
        deleteFromCloudinary(img.publicId).catch(err => 
          console.error('Failed to delete image:', err)
        )
      );
      await Promise.all(deletePromises);
    }

    // Delete car
    await Car.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
};

// POST /api/cars/:carId/favorite (Toggle favorite)
exports.toggleFavorite = async (req, res) => {
  try {
    const { carId } = req.params;

    // Validate car ID
    if (!isValidObjectId(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    // Verify car exists
    const carExists = await Car.exists({ _id: carId });
    if (!carExists) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Check if already favorited
    const user = await User.findById(req.user.id).select('favorites');
    const isFavorited = user.favorites.some(fav => fav.toString() === carId);

    // Use atomic operation to update favorites
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      isFavorited 
        ? { $pull: { favorites: carId } }
        : { $addToSet: { favorites: carId } },
      { new: true }
    ).select('favorites');

    res.json({
      success: true,
      action: isFavorited ? 'removed' : 'added',
      message: `Car ${isFavorited ? 'removed from' : 'added to'} favorites`,
      favorites: updatedUser.favorites
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
};

// DELETE /api/cars/:carId/images/:publicId (Delete specific car image)
exports.deleteCarImage = async (req, res) => {
  try {
    const { carId, publicId } = req.params;

    // Validate car ID
    if (!isValidObjectId(carId)) {
      return res.status(400).json({ error: 'Invalid car ID' });
    }

    // Verify car belongs to user
    const car = await Car.findOne({ _id: carId, host: req.user.id });
    
    if (!car) {
      return res.status(404).json({ 
        error: 'Car not found or you do not have permission to modify it' 
      });
    }

    // Find the image
    const imageIndex = car.images.findIndex(img => img.publicId === publicId);
    
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(publicId);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Remove from database
    car.images.splice(imageIndex, 1);
    
    // If deleted image was primary, make first remaining image primary
    if (car.images.length > 0 && !car.images.some(img => img.isPrimary)) {
      car.images[0].isPrimary = true;
    }

    await car.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
      car
    });
  } catch (error) {
    console.error('Delete car image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};