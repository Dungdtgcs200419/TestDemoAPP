const User_accounts = require("../models/User_account");
const { multipleMongooseToObject, moongoseToObject } = require("../../utility/mongoose");
const md5 = require('../../utility/md5');
const cookieParser = require("cookie-parser");
const res = require("express/lib/response");
const { redirect } = require("express/lib/response");


class User_Account {
  
  user(req, res, next) {
    User_accounts.find({})
    .then(User_accounts =>{
      res.render('accounts/user_account', {
        layout: 'admin',
        title: 'User accounts',
        User_accounts: multipleMongooseToObject(User_accounts),
        username: req.cookies.username
      });
    })
    .catch(next);
  }
  
}

module.exports = new User_Account();