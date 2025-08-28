const express = require('express');
const {
  register,
  login,
  getMe,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/auth');

const router = express.Router();

const { protect, adminAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.put('/users/:id', protect, adminAuth, updateUser);
router.delete('/users/:id', protect, adminAuth, deleteUser);

module.exports = router;
