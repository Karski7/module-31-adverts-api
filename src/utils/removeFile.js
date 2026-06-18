const fs = require('fs');
const path = require('path');

const removeFile = (filenameOrPath) => {
  if (!filenameOrPath) return;

  const filePath = path.isAbsolute(filenameOrPath)
    ? filenameOrPath
    : path.join(__dirname, '../../public/uploads', filenameOrPath);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

module.exports = removeFile;
