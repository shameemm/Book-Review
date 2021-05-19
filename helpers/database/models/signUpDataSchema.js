const mongoose = require("mongoose");
const userData = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    mobile: {
      type: Number,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    // bookLike: {
    //   type: Boolean,
    //   default: false,
    // },

    Date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "user-data" }
);
module.exports = mongoose.model("book-review", userData);
