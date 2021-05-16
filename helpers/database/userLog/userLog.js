var bcrypt = require("bcrypt");
var userDataSchema = require("../models/signUpDataSchema");

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
          .catch((err) => {
            reject(err);
          });
      }
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      var user = await userDataSchema.findOne({ email: userData.email });

      if (user) {
        await bcrypt
          .compare(userData.password, user.password)
          .then(() => {
            resolve(user);
          })
          .catch(() => {
            reject();
          });
      } else {
        reject();
      }
    });
  },
};
