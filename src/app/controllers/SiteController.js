const Product = require('../models/Product');
const Catalogs = require('../models/Catalog');
const User_accounts = require("../models/User_account");

const { multipleMongooseToObject, moongoseToObject } = require("../../utility/mongoose");
const md5 = require('../../utility/md5');
const cookieParser = require("cookie-parser");

class SiteController {
    
    //[get] /
    home(req, res, next) {
        //Find Products in Database
        
        Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                const sortDescendingView = {view: -1};
                Product.find({}).sort(sortDescendingView).limit(1)
                    .then(top1Views => {
                        top1Views = multipleMongooseToObject(top1Views)
                        Product.find({}).sort(sortDescendingView).skip(1).limit(2)
                            .then(top2_3Views => {
                                top2_3Views = multipleMongooseToObject(top2_3Views);
                                Product.find({}).sort(sortDescendingView).skip(3).limit(8)
                                    .then(top3_8Views =>{
                                        top3_8Views = multipleMongooseToObject(top3_8Views)
                                        res.render('home',{
                                            layout: 'main',
                                            Object: {
                                                top1Views,
                                                top2_3Views,
                                                top3_8Views,
                                                cataloglist,
                                            },
                                            WebUser: req.cookies.WebUser,
                                        });  
                                    })
                                    .catch(next);
                                
                            })
                            .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
    }

    //[get] /about
    about(req, res) {
        res.send('New Detail !!');
    }

    //[get] /products/:catalog_name
    catalog(req, res, next) {
        Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                Catalogs.findOne({
                    name: req.params.catalog_name,
                })
                    .then(catalog => {
                        catalog = moongoseToObject(catalog);
                        Product.find({
                            catalogid: catalog._id
                        })
                        .then(products => {
                            res.render('products', {
                                title: catalog.name,
                                Object: {
                                    cataloglist,
                                    products: multipleMongooseToObject(products),
                                    catalog,
                                },
                                WebUser: req.cookies.WebUser,
                            });
                        })
                        .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);

    }

    //[get] /product/:slug
    product(req, res, next) {
        Catalogs.find({})
            .then(catalogs => {
                let cataloglist = multipleMongooseToObject(catalogs);
                Product.findOne({
                    slug: req.params.slug,
                })
                    .then(product => {
                        product = moongoseToObject(product);
                        Catalogs.findOne({
                            _id: product.catalogid,
                        })
                        .then(catalog => {
                            catalog = moongoseToObject(catalog);
                            res.render('productdetail', {
                                title: product.productname,
                                Object: {
                                    cataloglist,
                                    product,
                                    catalog,
                                },
                                WebUser: req.cookies.WebUser,
                            });
                        })
                        .catch(next);
                    })
                    .catch(next);
            })
            .catch(next);
    }

    // [post] /signup
    signup(req, res, next) {
        
    }

    // [post] /check
    check(req, res, next) {
        const inputuser = req.body.user;
        const inputpassword = md5.MD5(req.body.password);

        User_accounts.findOne({
            $and: [{
                $or: [{username: inputuser}, {email: inputuser}],
                password: inputpassword
            }]
        })
            .then(user => {
                const outuser = moongoseToObject(user);

                res.cookie('WebUser', outuser.name);
                res.cookie('WebUserEmail', outuser.email);
                res.cookie('WebUserPassword', outuser.password);

                    
                res.redirect(req.get('referer'));
            })
            .catch(next);
    }

    // [get] /logout
    logout(req, res, next) {
        res.clearCookie("WebUser");
        res.clearCookie("WebUserEmail");
        res.clearCookie("WebUserPassword");
        res.redirect(req.get('referer'));

    }

}

module.exports = new SiteController;