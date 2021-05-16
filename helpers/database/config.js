var mongoose = require("mongoose");
module.exports = {
  dbConnection: () => {
    return new Promise(async (resolve, reject) => {
     await mongoose.connect(
        "mongodb+srv://nodeProject:@123456@cluster0.dp6nw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        (data,err) => {
          if (!err) {
            resolve(data);
            console.log("db connection succeccfull ");
          } else {
            reject(err);
            console.log("db connection fails"+err);
          }
        }
      );
    });
  },
};
