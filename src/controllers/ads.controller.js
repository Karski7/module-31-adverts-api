const mongoose = require('mongoose');

const Ad = require('../models/Ad.model');
const { validateAdPayload, validateImage } = require('../utils/validators');
const removeFile = require('../utils/removeFile');

const populateAuthor = {
  path: 'author',
  select: 'login phone avatar',
};

const serializeAd = (ad) => ({
  id: ad._id.toString(),
  title: ad.title,
  description: ad.description,
  location: ad.location,
  price: ad.price,
  photo: ad.photo,
  createdAt: ad.createdAt,
  updatedAt: ad.updatedAt,
  author: ad.author && {
    id: ad.author._id.toString(),
    login: ad.author.login,
    phone: ad.author.phone,
    avatar: ad.author.avatar,
  },
});

const listAds = async (req, res) => {
  const ads = await Ad.find({}).sort({ createdAt: -1 }).populate(populateAuthor);
  res.send({ ads: ads.map(serializeAd) });
};

const searchAds = async (req, res) => {
  const phrase = req.params.searchPhrase || '';
  const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const ads = await Ad.find({ title: regex }).sort({ createdAt: -1 }).populate(populateAuthor);

  res.send({ ads: ads.map(serializeAd) });
};

const getAd = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send({ message: 'Ad not found' });
  }

  const ad = await Ad.findById(req.params.id).populate(populateAuthor);
  if (!ad) return res.status(404).send({ message: 'Ad not found' });

  return res.send({ ad: serializeAd(ad) });
};

const createAd = async (req, res) => {
  const errors = validateAdPayload(req.body);
  const imageError = await validateImage(req.file, { required: true });
  if (imageError) errors.push(imageError);

  if (errors.length) {
    removeFile(req.file && req.file.path);
    return res.status(422).send({ errors });
  }

  const ad = await Ad.create({
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    location: req.body.location.trim(),
    price: Number(req.body.price),
    photo: req.file.filename,
    author: req.session.user.id,
  });

  await ad.populate(populateAuthor);
  return res.status(201).send({ ad: serializeAd(ad) });
};

const updateAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) {
    removeFile(req.file && req.file.path);
    return res.status(404).send({ message: 'Ad not found' });
  }

  if (ad.author.toString() !== req.session.user.id) {
    removeFile(req.file && req.file.path);
    return res.status(403).send({ message: 'Only author can edit this ad' });
  }

  const errors = validateAdPayload(req.body, { isUpdate: true });
  const imageError = await validateImage(req.file, { required: false });
  if (imageError) errors.push(imageError);

  if (errors.length) {
    removeFile(req.file && req.file.path);
    return res.status(422).send({ errors });
  }

  const oldPhoto = ad.photo;
  if (req.body.title !== undefined) ad.title = req.body.title.trim();
  if (req.body.description !== undefined) ad.description = req.body.description.trim();
  if (req.body.location !== undefined) ad.location = req.body.location.trim();
  if (req.body.price !== undefined) ad.price = Number(req.body.price);
  if (req.file) ad.photo = req.file.filename;

  await ad.save();
  if (req.file) removeFile(oldPhoto);

  await ad.populate(populateAuthor);
  return res.send({ ad: serializeAd(ad) });
};

const deleteAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) return res.status(404).send({ message: 'Ad not found' });

  if (ad.author.toString() !== req.session.user.id) {
    return res.status(403).send({ message: 'Only author can delete this ad' });
  }

  await ad.deleteOne();
  removeFile(ad.photo);

  return res.send({ message: 'Ad deleted' });
};

module.exports = {
  listAds,
  searchAds,
  getAd,
  createAd,
  updateAd,
  deleteAd,
};
