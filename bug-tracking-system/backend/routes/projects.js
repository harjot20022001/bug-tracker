const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projects');

const router = express.Router();

const ticketRouter = require('./tickets');

const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.route('/').get(protect, getProjects).post(protect, adminAuth, createProject);
router
  .route('/:id')
  .get(protect, getProject)
  .put(protect, adminAuth, updateProject)
  .delete(protect, adminAuth, deleteProject);

router.use('/:projectId/tickets', ticketRouter);

module.exports = router;
