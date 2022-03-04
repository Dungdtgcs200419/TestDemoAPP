const Admin_accounts = require("../models/Admin_account");
const { moongoseToObject } = require("../../utility/mongoose");
const Admin_account = require("../models/Admin_account");
const md5 = require('../../utility/md5');
const cookieParser = require("cookie-parser");



class AdminLoginPanel {

    login(req, res, next) {
        if(typeof req.cookies.username !== 'undefined'){
            // res.json(req.cookies);
            res.redirect('/admin/accounts/admin-Accounts');
        }else
        if(typeof req.query.error == 'undefined'){
            res.render('adminLogin', {
                layout: 'blank',
            });
        }else{
            switch(req.query.error){
                case '1':
                    res.render('adminLogin', {
                        layout: 'blank',
                        error: 'The password was incorrect! - Try Again'
                    });
                    break;
                case '2':
                    res.render('adminLogin', {
                        layout: 'blank',
                        error: 'Can not find this User! - Try Again'
                    });
                    break;
                case '3':
                    res.render('adminLogin', {
                        layout: 'blank',
                        error: 'Sorry this user is current disable!'
                    });
                    break;
            }
        }
        
    }

    

    check(req, res, next) {
        const formData = req.body;

        Admin_account.findOne({username: formData.username})
        .then((Admin_account) => {
            if(Admin_account){
                formData.password = md5.MD5(formData.password)
                // res.json({
                //     Admin_account,
                //     formData
                // })
                if(formData.password == Admin_account.password) {
                    if(Admin_account.status == 1){
                        res.redirect('/admin?error=3');
                    } else {
                        res.cookie('username', formData.username);
                        res.redirect('/admin/accounts/admin-Accounts');
                    }
                    
                }else{
                    res.redirect('/admin?error=1');
                }
            } else{
                res.redirect('/admin?error=2');
            }
        })
        .catch(next);
    }

    //[get] /account/change-password
    changpassword(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        if(typeof req.query.return == 'undefined'){
            res.render('adminChangePassword', {
                layout: 'admin',
                title: 'Change admin password',
            });
        }else{
            switch(req.query.return){
                case '0':
                    res.render('adminChangePassword', {
                        layout: 'admin',
                        title: 'Change admin password',
                        username: req.cookies.username,
                        alert: {
                            type: 'danger',
                            result: 'Error',
                            message: 'Wrong current password that you typed in!'
                        }
                    });
                    break;
                case '1':
                    res.render('adminChangePassword', {
                        layout: 'admin',
                        title: 'Change admin password',
                        username: req.cookies.username,
                        alert: {
                            type: 'danger',
                            result: 'Error',
                            message: 'Make sure to let the retype password is similar to your new password!'
                        }
                    });
                    break;
                case '2':
                    res.render('adminChangePassword', {
                        layout: 'admin',
                        title: 'Change admin password',
                        username: req.cookies.username,
                        alert: {
                            type: 'success',
                            result: 'Success',
                            username: req.cookies.username,
                            message: 'password has been updated!'
                        }
                    });
                    break;
            }
        }
        res.render('adminChangePassword', {
            layout: 'admin',
            username: req.cookies.username
        });
    }

    //[post] /account/change-password/update
    updatepassword(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Admin_accounts.findOne({
            username: req.cookies.username
        })
        .then(account => {
            account = moongoseToObject(account);
            if(account.password == md5.MD5(req.body.curPassword)) {
                if(req.body.typeInPassword == req.body.confirmPassword) {
                    Admin_accounts.updateOne({
                        username: req.cookies.username
                    }, {
                        password: md5.MD5(req.body.confirmPassword)
                    })
                    .then(() => {
                        res.redirect('/admin/account/change-password?return=2');
                    })
                    .catch(next);
                }else {
                    res.redirect('/admin/account/change-password?return=1')
                }
            }else {
                res.redirect('/admin/account/change-password?return=0')
            }           
        })
        .catch(next);
    }
}

module.exports = new AdminLoginPanel();