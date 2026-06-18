const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

const adsRoutes = require('./routes/ads.routes');
const authRoutes = require('./routes/auth.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const createApp = ({ sessionStore } = {}) => {
  const app = express();

  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: process.env.SESSION_SECRET || 'module-31-dev-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      maxAge: 1000 * 60 * 60 * 12,
    },
  }));

  app.use('/api/ads', adsRoutes);
  app.use('/auth', authRoutes);

  app.use(express.static(path.join(__dirname, '../client/build')));
  app.use(express.static(path.join(__dirname, '../public')));

  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/auth')) return next();
    return res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
