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
// add review render
router.get("/add-review", function (req, res, next) {
  res.render("user/add-review");
});
// validation user data from login page
router.post("/signIn", (req, res) => {
  userLogger
    .doLogin(req.body)
    .then((userData) => {
      console.log("user ready");
      res.send("first stage complete")
    })
    .catch((err) => {
      res.redirect('/')
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
      res.send("first stage complete")
    })
    .catch(() => {
      console.log("signup fail");
      res.redirect('/signUpPage')
    });
});
module.exports = router;
