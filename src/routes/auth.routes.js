const express = require('express');

const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', upload.single('avatar'), authController.register);
router.post('/login', authController.login);
router.get('/user', authMiddleware, authController.getCurrentUser);
router.delete('/logout', authMiddleware, authController.logout);

module.exports = router;
