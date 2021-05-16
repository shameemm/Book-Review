var express = require('express');
var router = express.Router();
var userLogger=require('../helpers/database/userLog/userLog')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/login');
});
router.get('/signUpPage', function(req, res, next) {
  res.render('user/signUp');
});
router.post('/signUp',(req,res)=>{
  userLogger.doSignUp(req.body).then(()=>{
    console.log("ok");
  }).catch(()=>{
    console.log("fail")
  })
})
module.exports = router;
