const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true,
  },

  ownerId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);