const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

router.use(isAdmin);
router.get('/user/:id', adminController.getUser);

module.exports = router;