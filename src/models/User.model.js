const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true, trim: true },
  avatar: { type: String, required: true, default: 'default-avatar.svg' },
}, {
  timestamps: true,
});

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    login: this.login,
    phone: this.phone,
    avatar: this.avatar,
  };
};

module.exports = mongoose.model('User', userSchema);
