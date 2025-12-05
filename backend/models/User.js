const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  state: { type: String, required: true }, // Selected from dropdown
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);