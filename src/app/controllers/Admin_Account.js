const Admin_accounts = require("../models/Admin_account");
const { multipleMongooseToObject, moongoseToObject } = require("../../utility/mongoose");
const md5 = require('../../utility/md5');
const cookieParser = require("cookie-parser");



class Admin_Account {
  //[get] /admin
  admin(req, res, next) {
    if(typeof req.cookies.username == 'undefined') {
      res.redirect('/admin');
    };
    Admin_accounts.find({})
      .then(Admin_accounts => {
        Admin_accounts = multipleMongooseToObject (Admin_accounts);
        //Modify status to print 
        Admin_accounts.forEach(function(part, index) {
          if(Admin_accounts[index].status == 0){
            Admin_accounts[index].status = "Active";
          }else{
            Admin_accounts[index].status = "Disable";
          }
        });
        //Render
        return res.render('accounts/admin_account', {
          layout: 'admin',
          title: 'Admin accounts',
          Admin_accounts,
          username: req.cookies.username
        });
      })
      // .then(Admin_accounts => res.json(Admin_accounts))
      .catch(next);
  }

  //[get] /admin/accounts/add
  add(req, res, next) {
    if(typeof req.cookies.username == 'undefined') {
      res.redirect('/admin');
    };
    res.render('accounts/add', { 
      layout: 'admin',
      title: "Add new admin account",
      username: req.cookies.username
  });
}

  //[get] /admin/logout
  logout(req, res, next){
    res.clearCookie('username');
    res.redirect('/admin');
  }

  //[post] /admin/accounts/save
  save(req, res, next) {
    // res.json(req.body);
    if(typeof req.cookies.username == 'undefined') {
      res.redirect('/admin');
    };
    //Save object to Database
    const formData = req.body;
    formData.password = md5.MD5(formData.password);
    const Admin_account = new Admin_accounts(formData);
    Admin_account.save()
      .then(() => {
        res.redirect('/admin/accounts/admin-Accounts');
      })
      .catch((error) => {
        let errorMsg;
        if (error.code == 11000) {
          errorMsg = Object.keys(error.keyValue)[0] + ' already exists.';
        } else {
          errorMsg = error.message;
        }
        res.status(400).send('Bad Request:' + errorMsg);
      });
  }

  //[get] /admin/:id/delete
  delete(req, res, next) {
    if(typeof req.cookies.username == 'undefined') {
      res.redirect('/admin');
    };
    Admin_accounts.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      res.redirect('/admin/accounts/admin-Accounts');
    })
    .catch(next);
  }

  //[get] /admin/:id/edit
  edit(req, res, next) {
    if(typeof req.cookies.username == 'undefined') {
      res.redirect('/admin');
    };
    Admin_accounts.findById(req.params.id)
      .then(account => {
        res.render('accounts/edit' , {
          layout: 'admin',
          account: moongoseToObject(account),
          title: 'Edit admin account',
          username: req.cookies.username
        })
      })
      .catch(next);
  }

  //[post] /admin/:id/update
  update(req, res, next) {
    if(typeof req.cookies.username == 'undefined') {
      res.redirect('/admin');
    };
    Admin_accounts.updateOne(
      {
        _id: req.params.id
      }, 
      {
        username: req.body.username,
        status: req.body.status
      }
    )
    .then(() => {
      res.redirect('/admin/accounts/admin-Accounts');
    })
    .catch((error) => {
      let errorMsg;
      if (error.code == 11000) {
        errorMsg = Object.keys(error.keyValue)[0] + ' already exists.';
      } else {
        errorMsg = error.message;
      }
      res.status(400).send('Bad Request:' + errorMsg);
    });
  }

  searchforAdminACC(req, res, next) {
    Admin_accounts.find({
        username: {$regex: req.body.search, $options: 'i'}
    })
      .then(Admin_accounts => {
        Admin_accounts = multipleMongooseToObject (Admin_accounts);
        //Modify status to print 
        Admin_accounts.forEach(function(part, index) {
          if(Admin_accounts[index].status == 0){
            Admin_accounts[index].status = "Active";
          }else{
            Admin_accounts[index].status = "Disable";
          }
        });
        //Render
        res.render('accounts/admin_account', {
          layout: 'admin',
          title: 'Admin accounts',
          Admin_accounts,
          username: req.cookies.username
        })
      })
      .catch(next); 
  }

}

module.exports = new Admin_Account();
