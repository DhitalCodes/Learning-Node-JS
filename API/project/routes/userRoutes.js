const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/authMiddleware');

router.use(isLoggedIn);
router.get('/profile', userController.getProfile);

module.exports = router;