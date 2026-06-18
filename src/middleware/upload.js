const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/[^a-z0-9.]+/gi, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeOriginalName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
});

module.exports = upload;
