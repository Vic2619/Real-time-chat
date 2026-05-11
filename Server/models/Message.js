const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    room: String,
    userId: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },
    
    username: String,
    message: String,
    senderId: {type: String,},
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);