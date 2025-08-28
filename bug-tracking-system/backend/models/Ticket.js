const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
  },
  submitter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Ticket', TicketSchema);
