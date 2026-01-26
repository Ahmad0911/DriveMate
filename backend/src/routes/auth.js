const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, uploadSingle, authController.updateProfile);
router.post('/become-host', authenticate, authController.becomeHost);

module.exports = router;