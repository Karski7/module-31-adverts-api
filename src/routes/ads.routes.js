const express = require('express');

const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const adsController = require('../controllers/ads.controller');

const router = express.Router();

router.get('/', adsController.listAds);
router.get('/search/:searchPhrase', adsController.searchAds);
router.get('/:id', adsController.getAd);
router.post('/', authMiddleware, upload.single('photo'), adsController.createAd);
router.patch('/:id', authMiddleware, upload.single('photo'), adsController.updateAd);
router.delete('/:id', authMiddleware, adsController.deleteAd);

module.exports = router;
