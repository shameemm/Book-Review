var bookDataSchema = require("../database/models/bookDataModel");
var commentDataSchema = require("../database/models/commentModel");
// var userDataSchema = require("../database/models/signUpDataSchema");
const fse = require("fs-extra");
module.exports = {
  bookDataAdder: (details, userId) => {
    return new Promise(async (resolve, reject) => {
      console.log(details);
      var dataSend = new bookDataSchema({
        userId: userId,
        ibnNumber: details.ibnNumber,
        bookName: details.bookName,
        authorName: details.authorName,
        language: details.language,
        description: details.description,
        purchaseLink: details.purchaseLink,
        yearOfPublication: details.yearOfPublication,
        Genre: details.Genre,
      });
      dataSend
        .save()
        .then((data) => {
          //   console.log("@@@2");
          resolve(data);
        })
        .catch((err) => {
          reject();
          console.log("$$$$" + err);
        });
    });
  },
  bookDataPicker: () => {
    return new Promise(async (resolve, reject) => {
      await bookDataSchema
        .find()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteBook: (bookId) => {
    return new Promise(async (resolve, reject) => {
      bookDataSchema
        .findByIdAndRemove(bookId)
        .then(() => {
          fse
            .remove("./public/cover-images/" + bookId + ".jpg")
            .then(() => {
              commentDataSchema
                .findOneAndDelete({ bookId: bookId })
                .then(() => {
                  fse
                    .remove("./public/booksPdf/" + bookId + ".pdf")
                    .then(() => {
                      resolve();
                    })
                    .catch((err) => {
                      reject();
                    });

                  // console.log("!@#$")
                })
                .catch((err) => {
                  reject();
                });
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        })
        .catch(() => {
          reject();
        });
    });
  },
  addComment: (details, userId) => {
    return new Promise(async (resolve, reject) => {
      console.log(userId);
      var comm = {
        userId: userId,
        comment: details.comment,
        rate: details.rate,
      };
      var commentExist = await commentDataSchema.findOne({
        bookId: details.bookId,
      });
      if (commentExist) {
        commentDataSchema
          .findOneAndUpdate(
            { bookId: details.bookId },
            {
              $push: { commentData: comm },
            }
          )
          .then(() => {
            // console.log("!!!");
            resolve();
          })
          .catch((err) => {
            reject();
            console.log(err + "@@@");
          });
      } else {
        var data = new commentDataSchema({
          bookId: details.bookId,
          commentData: [
            {
              userId: userId,
              comment: details.comment,
              rate: details.rate,
            },
          ],
        });
        data
          .save()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject();
            console.log(err);
          });
      }
    });
  },
  getBookDetails: (bookId) => {
    return new Promise(async (resolve, reject) => {
      await bookDataSchema
        .findById(bookId)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getBookReview: (bookId) => {
    return new Promise(async (resolve, reject) => {
      var commentExist = await commentDataSchema.findOne({
        bookId: bookId,
      });
      if (commentExist) {
        commentDataSchema
          .find({ bookId: bookId })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(false);
          });
      } else {
        resolve(false);
      }
    });
  },
  userVerify: (fullData, userId) => {
    return new Promise((resolve, reject) => {
      // console.log( fullData[0].bookId);
      var data = fullData[0].commentData;
      for (var i = 0; i < data.length; i++) {
        data[i].book_Id = fullData[0].bookId;
        if (data[i].userId == userId) {
          data[i].userVerification = true;
        }
      }
      resolve(data);
    });
  },
  deleteComment: (req, userId) => {
    return new Promise(async (resolve, reject) => {
      commentDataSchema
        .findOneAndUpdate(
          {
            bookId: req.bookId,
          },
          {
            $pull: { commentData: { _id: req.commentId } },
          }
        )
        .then((data) => {
          // console.log(data);
          resolve();
        })
        .then((err) => {
          reject(err);
        });
    });
  },
  editComment: (req) => {
    return new Promise(async (resolve, reject) => {
      await commentDataSchema
        .updateOne(
          {
            bookId: req.bookId,
            commentData: { $elemMatch: { _id: req.commentId } },
          },
          {
            $set: { "commentData.$.comment": req.text },
          }
        )

        .then((data) => {
          // console.log(data);
          resolve();
        })
        .then((err) => {
          reject(err);
        });
    });
  },
  commentLiker: (req, userId) => {
    return new Promise(async (resolve, reject) => {
      req.count = parseInt(req.count);
      commentDataSchema
        .updateOne(
          {
            bookId: req.bookId,
            commentData: { $elemMatch: { _id: req.commentId } },
          },
          {
            $inc: { "commentData.$.likes": req.count },
          }
        )
        .then(() => {
          console.log("!!!");
          resolve();
        })
        .catch((err) => {
          reject();
          console.log(err + "@@@");
        });
    });
  },
  bookLiker: (req, userId) => {
    return new Promise(async (resolve, reject) => {
      req.count = parseInt(req.count);
      var exist = await bookDataSchema.find({
        _id: req.bookId,
        likedId: { $elemMatch: { user: userId } },
      });
      if (!exist[0]) {
        if (req.count == 1) {
          bookDataSchema
            .updateOne(
              {
                _id: req.bookId,
              },
              {
                $inc: { likeNumber: req.count },
                $push: { likedId: { user: userId } },
              }
            )
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        }
      } else {
        if (req.count == -1) {
          bookDataSchema
            .updateOne(
              {
                _id: req.bookId,
              },
              {
                $inc: { likeNumber: req.count },
                $pull: { likedId: { user: userId } },
              }
            )
            .then(() => {
              resolve();
            })
            .then(() => {
              reject();
            });
        }
      }
    });
  },
  likeCheck: (data, userId) => {
    return new Promise((resolve, reject) => {
      var len = data.likedId.length;
      for (var i = 0; i < len; i++) {
        if (data.likedId[i].user == userId) data.likeCheck = true;
      }
      // console.log(data);
      resolve(data);
    });
  },
};
