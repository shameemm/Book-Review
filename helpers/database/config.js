var mongoose = require("mongoose");
module.exports = {
  dbConnection: () => {
    return new Promise(async (resolve, reject) => {
      mongoose.connect(
        "mongodb+srv://mubaris:3887@cluster0.lgafj.mongodb.net/book-review?retryWrites=true&w=majority",
        () => {
          console.log("database connected successfully");
        }
      );
    });
  },
};
