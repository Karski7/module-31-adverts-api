const bcrypt = require('bcryptjs');

const User = require('../models/User.model');
const Session = require('../models/Session.model');
const { validateImage } = require('../utils/validators');
const removeFile = require('../utils/removeFile');

const publicUser = (user) => user.toPublicJSON();

const register = async (req, res) => {
  const { login, password, phone } = req.body;
  const imageError = await validateImage(req.file, { required: false });

  if (imageError) return res.status(422).send({ message: imageError });

  if (!login || typeof login !== 'string' || login.trim().length < 3 ||
      !password || typeof password !== 'string' || password.length < 6 ||
      !phone || typeof phone !== 'string' || phone.trim().length < 5) {
    removeFile(req.file && req.file.path);
    return res.status(400).send({ message: 'Bad request' });
  }

  const existingUser = await User.findOne({ login: login.trim() });
  if (existingUser) {
    removeFile(req.file && req.file.path);
    return res.status(409).send({ message: 'Login is already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    login: login.trim(),
    passwordHash,
    phone: phone.trim(),
    avatar: req.file ? req.file.filename : 'default-avatar.svg',
  });

  return res.status(201).send({ user: publicUser(user) });
};

const login = async (req, res) => {
  const { login: loginValue, password } = req.body;

  if (!loginValue || typeof loginValue !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).send({ message: 'Bad request' });
  }

  const user = await User.findOne({ login: loginValue.trim() });
  if (!user) return res.status(401).send({ message: 'Invalid login or password' });

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return res.status(401).send({ message: 'Invalid login or password' });

  req.session.user = {
    id: user._id.toString(),
    login: user.login,
  };

  return res.send({ message: 'Logged in', user: publicUser(user) });
};

const getCurrentUser = async (req, res) => {
  if (!req.session.user) return res.status(401).send({ message: 'You are not authorized' });

  const user = await User.findById(req.session.user.id);
  if (!user) return res.status(404).send({ message: 'User not found' });

  return res.send({ user: publicUser(user) });
};

const logout = async (req, res) => {
  if (process.env.NODE_ENV !== 'production') await Session.deleteMany({});

  req.session.destroy((error) => {
    if (error) return res.status(500).send({ message: 'Logout failed' });
    return res.send({ message: 'Logged out' });
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
};
