var express = require("express");
var router = express.Router();
var userLogger = require("../helpers/userHelpers/userLog/userLog");
var userHelpers = require("../helpers/userHelpers/userHelper");

const verifyLogin = (req, res, next) => {
  if (req.session.userLogin) {
    next();
  } else {
    res.redirect("/");
    req.session.userErr = true;
  }
};
/* logIn page render */
router.get("/", (req, res, next) => {
  res.render("user/signIn");
});
// signup page render
router.get("/signUpPage", (req, res, next) => {
  res.render("user/signUp");
});
// validation user data from login page
router.post("/signIn", async (req, res) => {
  userLogger
    .doLogin(req.body)
    .then((userData) => {
      req.session.user = userData;
      req.session.userLogin = true;
      res.redirect("/home");
      // console.log("@@@@");
    })
    .catch((err) => {
      // console.log("%%%%");
      req.session.userErr = true;
      res.redirect("/");

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
    .then((userData) => {
      req.session.user = userData;
      req.session.userLogin = true;
      res.redirect("/home");
    })
    .catch(() => {
      console.log("signup fail");
      res.redirect("/signUpPage");
      req.session.userErr = true;
    });
});
/* Home page rendering */
router.get("/home", verifyLogin, async (req, res) => {
  userHelpers
    .bookDataPicker()
    .then((data) => {
      // console.log(data)
      res.render("user/homePage", {
        name: req.session.user.username,
        books: data,
      });
    })
    .catch((err) => {
      res.send("some think went wrong");
    });
});
router.get("/addBook", verifyLogin, (req, res) => {
  res.render("user/addBook");
});
router.post("/booksAddToDb", verifyLogin, (req, res) => {
  var image = req.files.bookImage;
  userHelpers.bookDataAdder(req.body, req.session.user._id).then((data) => {
    if (image)
      image
        .mv("./public/cover-images/" + data._id + ".jpg")
        .then(() => {
          // console.log("@@@@");
          res.redirect("/home");
        })
        .catch((err) => {
          console.log(err);
        });
    // console.log(data)
  });
});
router.get("/logOut", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
router.get("/deleteBook/:id", verifyLogin, (req, res) => {
  console.log(req.params.id);
  userHelpers
    .deleteBook(req.params.id)
    .then(() => {
      res.redirect("/home");
    })
    .catch((err) => {
      res.send("some thing went wrong");
    });
});
module.exports = router;
