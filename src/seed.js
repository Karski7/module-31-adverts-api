const bcrypt = require('bcryptjs');

const Ad = require('./models/Ad.model');
const User = require('./models/User.model');

const seedDatabase = async () => {
  const usersCount = await User.countDocuments();
  if (usersCount > 0) return;

  const passwordHash = await bcrypt.hash('secret123', 10);
  const user = await User.create({
    login: 'demo',
    passwordHash,
    phone: '+48 555 123 456',
    avatar: 'default-avatar.svg',
  });

  await Ad.create([
    {
      title: 'City bike',
      description: 'Comfortable city bike in very good condition, ready for everyday commuting.',
      location: 'Warsaw',
      price: 900,
      photo: 'sample-bike.svg',
      author: user._id,
    },
    {
      title: 'Standing desk',
      description: 'Electric standing desk with memory presets and a clean wooden top.',
      location: 'Krakow',
      price: 1200,
      photo: 'sample-desk.svg',
      author: user._id,
    },
  ]);
};

module.exports = { seedDatabase };
