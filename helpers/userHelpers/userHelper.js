var bookDataSchema = require("../database/models/bookDataModel");
var commentDataSchema = require("../database/models/commentModel");
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
              commentDataSchema.findOneAndDelete({bookId:bookId}).then(()=>{
                resolve();
                // console.log("!@#$")
              }).catch((err)=>{
                reject()
              })
            
            })
            .catch((err) => {
              console.log(err);
              reject()
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
        rate:details.rate
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
            resolve()
          })
          .catch((err) => {
            reject()
            console.log(err + "@@@");
          });
      }else{

      var data = new commentDataSchema({
        bookId: details.bookId,
        commentData: [
          {
            userId: userId,
            comment: details.comment,
            rate:details.rate
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
  getBookDetails:(bookId)=>{
    return new Promise(async(resolve,reject)=>{
      await bookDataSchema.findById(bookId).then((data)=>{
        resolve(data)
      }).catch((err)=>{
        reject(err)
      })
    })
  },
  getBookReview:(bookId)=>{
    return new Promise(async(resolve,reject)=>{
      var commentExist = await commentDataSchema.findOne({
        bookId:bookId,
      });
      if(commentExist){
        commentDataSchema.find({bookId:bookId}).then((data)=>{
          resolve(data)
        }).catch((err)=>{
          reject(false)
        })
      }else{
        resolve(false)
      }
    })
  }
};
