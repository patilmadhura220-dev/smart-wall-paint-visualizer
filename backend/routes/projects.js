const express = require('express');
const { Project } = require('../models/models');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth());

// List current user's saved projects
router.get('/', async (req, res) => {
  const projects = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 });
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// Save a new project (room photo + wall selections + rendered preview)
router.post('/', async (req, res) => {
  const { name, originalImage, wallSelections, finalImage } = req.body;
  if (!originalImage) return res.status(400).json({ error: 'originalImage is required' });

  const project = await Project.create({
    owner: req.user.id,
    name,
    originalImage,
    wallSelections,
    finalImage,
  });
  res.status(201).json(project);
});

// Update an existing project (new design trial on same photo)
router.put('/:id', async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.delete('/:id', async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

module.exports = router;
