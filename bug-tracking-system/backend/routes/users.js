const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const router = express.Router();

const { protect, adminAuth } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getUsers); 

router
  .route('/:id')
  .get(getUser)
  .put(adminAuth, updateUser) 
  .delete(adminAuth, deleteUser); 

module.exports = router;
