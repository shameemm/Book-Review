var express = require("express");
var router = express.Router();
var userLogger = require("../helpers/database/userLog/userLog");

/* logIn page render */
router.get("/", function (req, res, next) {
  res.render("user/signIn");
});
// signup page render
router.get("/signUpPage", function (req, res, next) {
  res.render("user/signUp");
});
// validation user data from login page
router.post("/signIn", (req, res) => {
  userLogger
    .doLogin(req.body)
    .then((userData) => {
      console.log("user ready");
    })
    .catch((err) => {
      if (err) {
        console.log("pass err");
      } else {
        console.log("nno user");
      }
    });
});
// data from signup page
router.post("/signUp", (req, res) => {
  
  userLogger
    .doSignUp(req.body)
    .then(() => {
      console.log("ok");
    })
    .catch(() => {
      console.log("fail");
    });
});
module.exports = router;
