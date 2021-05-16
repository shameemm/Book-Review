var bcrypt=require('bcrypt');
var userDateSchema=require('../models/signUpDataSchema')
module.exports = {
  doSignUp: (userData) => {
    return new Promise(async (resolve, reject) => {
      var user = await userDateSchema.findOne({ email: userData.email });
      if (user) {
        reject("user mail exist");
        console.log("mail already exist");
      } else {
        userData.password = await bcrypt.hash(userData.password, 10);
        var data = new userDateSchema({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        });
        data
          .save()
          .then((data) => {
            // console.log("success 111" + data);
            resolve(data);
          })
          .catch((err) => {
            console.log("err 111" + err);
          });
      }
    });
  },
  doSignin: (userData) => {
    return new Promise(async (resolve, reject) => {
      var user = await userDateSchema.findOne({ email: userData.email });
      if (user) {
        console.log("user found");
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            resolve(user);
            console.log("correct pass");
          } else {
            resolve(status);
            console.log("incorrect pass");
          }
        });
      } else {
        console.log("no user found");
        reject("no user found");
      }
    });
  },
};
