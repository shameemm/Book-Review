const mongoose = require("mongoose");
const booksData = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      // type:String,
      require: true,
    },
    ibnNumber: {
      type: String,
      require: true,
    },
    bookName: {
      type: String,
      require: true,
    },
    authorName: {
      type: String,
      require: true,
    },
    language: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    purchaseLink: {
      type: String,
      require: true,
    },
    yearOfPublication: {
      type: String,
      require: true,
    },
    Genre: {
      type: String,
      require: true,
    },
    rate:{type:Number,default:0},
    ratedIds:[{type: mongoose.Types.ObjectId}],
    
    likeNumber: { type: Number, default: 0, minimum: 0 },
    likedId: [
      {
        user: { type: mongoose.Types.ObjectId },
        // ckeck: { type: Boolean, default: true },
      },
    ],
    likeCheck: { type: Boolean, default: false },
    Date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "books-data" }
);
module.exports = mongoose.model("books-data", booksData);
