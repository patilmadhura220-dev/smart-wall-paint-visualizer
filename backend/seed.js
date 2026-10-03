require('dotenv').config();
const mongoose = require('mongoose');
const { Color } = require('./models/models');

const colors = [
  { name: 'Ocean Breeze Blue', hex: '#5B8FA8', brand: 'Generic', finish: 'matte', category: 'Living Room' },
  { name: 'Warm Sand Beige', hex: '#D8C3A5', brand: 'Generic', finish: 'eggshell', category: 'Bedroom' },
  { name: 'Classic Ivory White', hex: '#F2EFE9', brand: 'Generic', finish: 'matte', category: 'Ceiling' },
  { name: 'Forest Sage Green', hex: '#7C9473', brand: 'Generic', finish: 'satin', category: 'Accent' },
  { name: 'Sunset Terracotta', hex: '#C1694F', brand: 'Generic', finish: 'matte', category: 'Accent' },
  { name: 'Charcoal Slate Grey', hex: '#4A4E52', brand: 'Generic', finish: 'glossy', category: 'Accent' },
  { name: 'Blush Pink Pastel', hex: '#E8C4C4', brand: 'Generic', finish: 'eggshell', category: 'Bedroom' },
  { name: 'Deep Royal Blue', hex: '#2A4A73', brand: 'Generic', finish: 'satin', category: 'Living Room' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Color.deleteMany({});
  await Color.insertMany(colors);
  console.log(`Seeded ${colors.length} colors`);
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
