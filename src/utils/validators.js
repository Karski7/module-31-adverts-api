const getImageFileType = require('./getImageFileType');
const removeFile = require('./removeFile');

const allowedImageTypes = ['image/png', 'image/jpeg', 'image/gif'];

const validateImage = async (file, { required = true } = {}) => {
  if (!file) {
    if (required) return 'Image file is required.';
    return null;
  }

  const imageType = await getImageFileType(file);
  if (!allowedImageTypes.includes(imageType)) {
    removeFile(file.path);
    return 'Only png, jpg and gif image files are allowed.';
  }

  return null;
};

const validateAdPayload = (body, { isUpdate = false } = {}) => {
  const errors = [];

  if (!isUpdate || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length < 3) {
      errors.push('Title must contain at least 3 characters.');
    }
  }

  if (!isUpdate || body.description !== undefined) {
    if (typeof body.description !== 'string' || body.description.trim().length < 10) {
      errors.push('Description must contain at least 10 characters.');
    }
  }

  if (!isUpdate || body.location !== undefined) {
    if (typeof body.location !== 'string' || body.location.trim().length < 2) {
      errors.push('Location must contain at least 2 characters.');
    }
  }

  if (!isUpdate || body.price !== undefined) {
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) {
      errors.push('Price must be a positive number.');
    }
  }

  return errors;
};

module.exports = {
  validateAdPayload,
  validateImage,
};
