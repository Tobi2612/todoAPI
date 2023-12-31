const express = require('express');
const {
    register,
    login,
    logout
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/logout').get(protect, logout);

module.exports = router