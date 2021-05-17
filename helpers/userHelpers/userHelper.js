var bookDataSchema = require("../database/models/bookDataModel");
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
              resolve();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          reject();
        });
    });
  },
};
