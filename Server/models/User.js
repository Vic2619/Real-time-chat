const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
  type: String,
  default: "",
  },

  bio: {
    type: String,
    default: "",
  },

  activeToken: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", userSchema);