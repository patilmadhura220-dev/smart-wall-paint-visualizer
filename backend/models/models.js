const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favoriteColors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }],
}, { timestamps: true });

const ColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  brand: { type: String, default: 'Generic' },
  finish: { type: String, enum: ['matte', 'satin', 'glossy', 'eggshell'], default: 'matte' },
  category: { type: String, default: 'General' },
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Untitled Project' },
  originalImage: { type: String, required: true }, // base64 or file URL
  wallSelections: [{
    points: [{ x: Number, y: Number }], // polygon coordinates
    colorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
    opacity: { type: Number, default: 0.85 },
  }],
  finalImage: { type: String }, // rendered preview, base64
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Color = mongoose.model('Color', ColorSchema);
const Project = mongoose.model('Project', ProjectSchema);

module.exports = { User, Color, Project };
