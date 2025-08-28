const Project = require('../models/Project');

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).populate('owner', 'name email');

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }


    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.createProject = async (req, res, next) => {
  req.body.owner = req.user.id;

  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name email');

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
