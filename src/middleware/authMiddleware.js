const Session = require('../models/Session.model');

const authMiddleware = async (req, res, next) => {
  if (req.session && req.session.user) return next();

  if (process.env.NODE_ENV !== 'production') {
    try {
      const sessionRecord = await Session.findOne({}).sort({ expires: -1 });
      if (!sessionRecord) return res.status(401).send({ message: 'You are not authorized' });

      const sessionData = JSON.parse(sessionRecord.session);
      if (!sessionData.user) return res.status(401).send({ message: 'You are not authorized' });

      req.session.user = {
        id: sessionData.user.id,
        login: sessionData.user.login,
      };
      return next();
    } catch (error) {
      return res.status(401).send({ message: 'You are not authorized' });
    }
  }

  return res.status(401).send({ message: 'You are not authorized' });
};

module.exports = authMiddleware;
