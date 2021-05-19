const mongoose = require("mongoose");
const comments = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    commentData: [
      {
        userId: {
          type: mongoose.Types.ObjectId,
          require: true,
        },
        comment: {
          type: String,
          require: true,
        },
        rate: {
          type: Number,
          require: true,
        },
        userVerification: {
          type: Boolean,
        },
        book_Id: {
          type: mongoose.Types.ObjectId,
          require: true,
        },
        likes: { type: Number, default:0 },
        likedIds: [{ type: mongoose.Types.ObjectId }],
        Date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { collection: "comments" }
);
module.exports = mongoose.model("comments", comments);
