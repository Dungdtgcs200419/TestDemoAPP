const { multipleMongooseToObject, moongoseToObject } = require('../../utility/mongoose');
const Transaction = require('../models/Transaction');
const User_accounts = require('../models/User_account');

const md5 = require('../../utility/md5');
const cookieParser = require('cookie-parser');
const { transaction } = require('./SiteController');


class Admin_Transaction {

    show(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.find({})
            .then(transactions => {
                res.render('transaction/transaction', {
                    layout: 'admin', 
                    username: req.cookies.username,
                    title: 'Transactions',
                    transactions: multipleMongooseToObject(transactions)
                })
            })
    }

    specifictransorders(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.findOne({
            _id: req.params.trans_id,
        })
            .then(transaction => {
                transaction =  moongoseToObject(transaction);

                for(let i=0; i<transaction.Products.length; i++) {
                    if(transaction.Products[i].status == 0){
                        transaction.Products[i].statusString = 'Waiting';

                    } else if(transaction.Products[i].status == 1){
                        transaction.Products[i].statusString = 'On going';
                    } else if(transaction.Products[i].status == 2){
                        transaction.Products[i].statusString = 'Finished';
                        transaction.Products[i].AcceptOrder = true;
                    }
                    transaction.Products[i].trans_id = transaction._id
                }

                res.render('transaction/allOrders', {
                    layout: 'admin',
                    username: req.cookies.username,
                    title: 'All Orders',
                    transaction,
                })
            })
    }

    updateStatus(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.findByIdAndUpdate(req.params.trans_id)
            .then(transaction => {
                transaction = moongoseToObject(transaction);
                for(let i=0; i<transaction.Products.length; i++) {
                    if(transaction.Products[i]._id == req.params.product_id) {
                        transaction.Products[i].status  =  transaction.Products[i].status + 1 ;
                        break;
                    }
                }

                Transaction.findByIdAndUpdate(req.params.trans_id, transaction)
                    .then(() => {
                        res.redirect(req.get('referer'));
                    })
                    .catch(next);
                
            })
            .catch(next);
    }

    showorders(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.find({})
            .then(transactions => {
                transactions =  multipleMongooseToObject(transactions);

                transactions.forEach(function(part, index) {
                    for(let i=0; i<transactions[index].Products.length; i++) {
                        if(transactions[index].Products[i].status == 0){
                            transactions[index].Products[i].statusString = 'Waiting';
    
                        } else if(transactions[index].Products[i].status == 1){
                            transactions[index].Products[i].statusString = 'On going';
                        } else if(transactions[index].Products[i].status == 2){
                            transactions[index].Products[i].statusString = 'Finished';
                            transactions[index].Products[i].AcceptOrder = true;
                        }
                        transactions[index].Products[i].trans_id = transactions[index]._id
                    }

                  });

                res.render('transaction/allOrders', {
                    layout: 'admin',
                    username: req.cookies.username,
                    title: 'All Orders',
                    transactions,
                })
            })
    }

    waiting(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.find({})
            .then(transactions => {
                transactions =  multipleMongooseToObject(transactions);

                transactions.forEach(function(part, index) {
                    for(let i=0; i<transactions[index].Products.length; i++) {
                        if(transactions[index].Products[i].status == 0) {
                            transactions[index].Products[i].statusString = 'Waiting';
                            transactions[index].Products[i].trans_id = transactions[index]._id;
                        } else if(transactions[index].Products[i].status == 1){
                            transactions[index].Products.splice(i, 1);
                        } else if(transactions[index].Products[i].status == 2){
                            transactions[index].Products.splice(i, 1);
                        }

                    }
                  });

                res.render('transaction/waiting', {
                    layout: 'admin',
                    username: req.cookies.username,
                    title: 'Waiting Orders',
                    transactions,
                })
            })
    }

    ongoing(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.find({})
            .then(transactions => {
                transactions =  multipleMongooseToObject(transactions);

                transactions.forEach(function(part, index) {
                    for(let i=0; i<transactions[index].Products.length; i++) {
                        if(transactions[index].Products[i].status == 0) {
                            transactions[index].Products.splice(i, 1);
                        } else if(transactions[index].Products[i].status == 1){
                            transactions[index].Products[i].statusString = 'On Going';
                            transactions[index].Products[i].trans_id = transactions[index]._id;
                        } else if(transactions[index].Products[i].status == 2){
                            transactions[index].Products.splice(i, 1);
                        }

                    }
                  });

                res.render('transaction/ongoing', {
                    layout: 'admin',
                    username: req.cookies.username,
                    title: 'On Going Orders',
                    transactions,
                })
            })
    }

    finished(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.find({})
            .then(transactions => {
                transactions =  multipleMongooseToObject(transactions);

                transactions.forEach(function(part, index) {
                    for(let i=0; i<transactions[index].Products.length; i++) {
                        if(transactions[index].Products[i].status == 0) {
                            transactions[index].Products.splice(i, 1);
                        } else if(transactions[index].Products[i].status == 1){
                            transactions[index].Products.splice(i, 1);
                        } else if(transactions[index].Products[i].status == 2){
                            transactions[index].Products[i].statusString = 'Finished';
                            transactions[index].Products[i].trans_id = transactions[index]._id;
                        }

                    }
                  });

                res.render('transaction/finished', {
                    layout: 'admin',
                    username: req.cookies.username,
                    title: 'Finished Orders',
                    transactions,
                })
            })
    }

    searchforTrans(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Transaction.find({
            $or: [
                {
                    "user.username": {$regex: req.body.search, $options: 'i'} 
                },
                {
                    "user.email": {$regex: req.body.search, $options: 'i'} 
                },
                {
                    "user.phone": {$regex: req.body.search, $options: 'i'} 
                },
                // {
                //     "_id": {$regex: req.body.search, $options: 'i'} 
                // },
            ]
        })
            .then(transactions => {
                res.render('transaction/transaction', {
                    layout: 'admin', 
                    username: req.cookies.username,
                    title: 'Transactions',
                    transactions: multipleMongooseToObject(transactions)
                })
            })
    }

}

module.exports = new Admin_Transaction;