var bcrypt = require("bcrypt");
var userDataSchema = require("../../database/models/signUpDataSchema");

module.exports = {
  doSignUp: (userData) => {
    return new Promise(async (resolve, reject) => {
      var user = await userDataSchema.findOne({ email: userData.email });
      if (user) {
        reject(user);
      } else {
        userData.password = await bcrypt.hash(userData.password, 10);
        var data = new userDataSchema({
          username: userData.name,
          mobile: userData.mobile,
          email: userData.email,
          password: userData.password,
        });
        data
          .save()
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      }
    });
  },
  doLogin: (userLoginData) => {
    return new Promise(async (resolve, reject) => {
      var userData = await userDataSchema.findOne({ email: userLoginData.email });

      if (userData) {
        await bcrypt
          .compare(userLoginData.password, userData.password)
          .then((status) => {
            if (status) {
              console.log("true 2222");
              resolve(userData);
            } else {
              reject(true);
              console.log("false");
            }
          });
      } else {
        reject();
      }
    });
  },
};
