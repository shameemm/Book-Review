var express = require("express");
var router = express.Router();
var userLogger = require("../helpers/userHelpers/userLog/userLog");
var userHelpers = require("../helpers/userHelpers/userHelper");
const userHelper = require("../helpers/userHelpers/userHelper");

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
// add review render
router.get("/add-review", function (req, res, next) {
  res.render("user/add-review");
});
router.get("/book-table", (req, res, next) => {
  res.render("user/homePage");
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
      res.render("user/home", {
        name: req.session.user.username,
        books: data,
      });
    })
    .catch((err) => {
      res.send("some think went wrong");
    });
});
router.get("/addBook", verifyLogin, (req, res) => {
  res.render("user/addBook", { name: req.session.user.username });
});
router.post("/booksAddToDb", verifyLogin, (req, res) => {
  var image = req.files.bookImage;
  var file = req.files.bookFile;
  console.log(req.files);
  userHelpers.bookDataAdder(req.body, req.session.user._id).then((data) => {
    if (image && file) {
      image
        .mv("./public/cover-images/" + data._id + ".jpg")
        .then(() => {
          file
            .mv("./public/booksPdf/" + data._id + ".pdf")
            .then(() => {
              // console.log("@@@@");
              res.redirect("/home");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
router.get("/toComment/:id", verifyLogin, (req, res) => {
  res.render("user/addComment", {
    bookId: req.params.id,
    name: req.session.user.username,
  });
});
router.post("/addCommentToTheDb", verifyLogin, (req, res) => {
  userHelpers
    .addComment(req.body, req.session.user._id)
    .then(() => {
      res.redirect("/bookField/" + req.body.bookId);
    })
    .catch(() => {
      res.send("comment add fails");
    });
});
router.get("/bookField/:id", verifyLogin, (req, res) => {
  userHelper
    .getBookDetails(req.params.id)
    .then((data) => {
      // console.log(data);
      userHelper
        .likeCheck(data, req.session.user._id)
        .then((chekedData) => {
          userHelper
            .getBookReview(req.params.id)
            .then((comments) => {
              // console.log(comments);
              if (comments[0].commentData) {
                userHelper
                  .userVerify(comments, req.session.user._id)
                  .then((com) => {
                    if (com) {
                      res.render("user/bookView", {
                        details:chekedData,
                        review: com,
                        name: req.session.user.usename,
                      });
                      // console.log(com);
                    }
                  });
              } else {
                res.render("user/bookView", {
                  details: data,
                  name: req.session.user.username,
                });
              }
            })
            .catch((err) => {
              res.render("user/bookView", {
                details: data,
                name: req.session.user.username,
              });
            });
        })
        .catch(() => {
          res.status(404);
        });
    })
    .catch((err) => {
      res.send("err" + err);
    });
});
router.post("/deleteComment", verifyLogin, (req, res, next) => {
  // console.log(req.body);
  userHelper
    .deleteComment(req.body, req.session.user._id)
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.send(err);
    });
});
router.post("/editComment", verifyLogin, (req, res, next) => {
  // console.log(req.body);

  userHelper
    .editComment(req.body)
    .then(() => {
      res.json(true);
      // console.log("oo");
    })
    .catch((err) => {
      res.send(err);
    });
});
router.get("/download/:bookId", (req, res) => {
  console.log(req.params.bookId);
  res.download(
    "./public/booksPdf/" + req.params.bookId + ".pdf",
    "thisisbook.pdf",
    (err) => {
      if (err) console.log(err);
      else console.log("suces");
    }
  );
});
router.post("/likeCount", verifyLogin, (req, res) => {
  // console.log(req.body)
  userHelper
    .commentLiker(req.body, req.session.user._id)
    .then(() => {
      res.json(true);
    })
    .catch(() => {});
});
router.post("/bookLiker", verifyLogin, (req, res) => {
  console.log(req.body);
  userHelper
    .bookLiker(req.body, req.session.user._id)
    .then(() => {
      res.json(true);
    })
    .then((err) => {
      res.send("err");
    });
});
module.exports = router;
