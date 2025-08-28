const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const User = require('../models/User');
const emailService = require('../services/emailService');

exports.getTickets = async (req, res, next) => {
  try {
    let query = { project: req.params.projectId };
    let searchConditions = [];
    let assignedConditions = [];
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      searchConditions = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }
    
    // Filter by priority
    if (req.query.priority && req.query.priority !== 'all') {
      query.priority = req.query.priority;
    }
    
    // Filter by assigned user
    if (req.query.assignedTo && req.query.assignedTo !== 'all') {
      if (req.query.assignedTo === 'unassigned') {
        assignedConditions = [
          { assignedTo: { $exists: false } },
          { assignedTo: null }
        ];
      } else {
        query.assignedTo = req.query.assignedTo;
      }
    }
    
    // Combine search and assignment conditions using $and
    if (searchConditions.length > 0 && assignedConditions.length > 0) {
      query.$and = [
        { $or: searchConditions },
        { $or: assignedConditions }
      ];
    } else if (searchConditions.length > 0) {
      query.$or = searchConditions;
    } else if (assignedConditions.length > 0) {
      query.$or = assignedConditions;
    }

    const tickets = await Ticket.find(query)
      .populate('submitter', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('project', 'name description')
      .populate('submitter', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.createTicket = async (req, res, next) => {
  req.body.project = req.params.projectId;
  req.body.submitter = req.user.id;

  if (req.body.assignedTo === '') {
    req.body.assignedTo = null;
  }

  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const ticket = await Ticket.create(req.body);
    
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('submitter', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    if (populatedTicket.assignedTo && populatedTicket.assignedTo._id.toString() !== req.user.id) {
      const assigner = await User.findById(req.user.id);
      await emailService.sendTicketAssignmentEmail(populatedTicket, populatedTicket.assignedTo, assigner);
    }

    res.status(201).json({
      success: true,
      data: populatedTicket,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    let ticket = await Ticket.findById(req.params.id)
      .populate('submitter', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    const originalValues = {
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo?._id?.toString()
    };

    if (req.body.assignedTo === '') {
      req.body.assignedTo = null;
    }

    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('submitter', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    const changes = {};
    const updatedBy = await User.findById(req.user.id);
    let assignmentChanged = false;

    if (originalValues.assignedTo !== ticket.assignedTo?._id?.toString()) {
      assignmentChanged = true;
      if (ticket.assignedTo && ticket.assignedTo._id.toString() !== req.user.id) {
        await emailService.sendTicketAssignmentEmail(ticket, ticket.assignedTo, updatedBy);
      }
      changes.assignedTo = {
        old: originalValues.assignedTo ? 'Assigned' : 'Unassigned',
        new: ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'
      };
    }

    if (originalValues.status !== ticket.status) {
      changes.status = { old: originalValues.status, new: ticket.status };
    }
    if (originalValues.priority !== ticket.priority) {
      changes.priority = { old: originalValues.priority, new: ticket.priority };
    }
    if (originalValues.title !== ticket.title) {
      changes.title = { old: originalValues.title, new: ticket.title };
    }

    if (Object.keys(changes).length > 0 && (ticket.assignedTo || assignmentChanged)) {
      await emailService.sendTicketUpdateEmail(ticket, updatedBy, changes);
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admin users can delete tickets' });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
