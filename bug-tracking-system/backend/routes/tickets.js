const express = require('express');
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers/tickets');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.route('/').get(protect, getTickets).post(protect, createTicket);
router
  .route('/:id')
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

module.exports = router;
