const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    username: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    image: {
      type: Buffer,
      data: Buffer,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("post", postSchema);
