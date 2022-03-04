const express = require('express');
const router = express.Router();

const admin_account = require('../app/controllers/Admin_Account');
const user_account = require('../app/controllers/User_Account');
const adminLoginPanel = require('../app/controllers/AdminLoginPanel');
const catalog = require('../app/controllers/Catalog_Admin');
const product = require('../app/controllers/Product_Admin');
const transaction = require('../app/controllers/Admin_Transaction');




//admin accounts (admin) [get]
router.get('/accounts/add', admin_account.add);
router.get('/accounts/admin-Accounts', admin_account.admin);
router.get('/logout', admin_account.logout);
router.get('/accounts/:id/delete', admin_account.delete);
router.get('/accounts/:id/edit', admin_account.edit);

//admin accounts (admin) [post]
router.post('/accounts/admin-Accounts', admin_account.searchforAdminACC);
router.post('/accounts/save', admin_account.save);
router.post('/check', adminLoginPanel.check);
router.post('/accounts/:id/update', admin_account.update);


//user accounts (admin) [get]
router.get('/accounts/user-Accounts', user_account.user);

//user accounts (admin) [post]
router.post('/accounts/user-Accounts', user_account.searchforUserACC);


//catalog [get]
router.get('/catalogs', catalog.show);
router.get('/catalogs/add', catalog.add)
router.get('/catalogs/:id/delete', catalog.delete);
router.get('/catalogs/:id/edit', catalog.edit)

//catalog [post]
router.post('/catalogs', catalog.searchforCatalog);
router.post('/catalogs/save', catalog.save);
router.post('/catalogs/:id/update', catalog.update);

//product [get]
router.get('/products', product.show);
router.get('/products/add', product.add);
router.get('/products/:id/delete', product.delete);
router.get('/products/:id/edit', product.edit);

//product [post]
router.post('/products', product.searchforProducts);
router.post('/products/save', product.save);
router.post('/products/:id/update', product.update);

//transaction [get]
router.get('/transaction', transaction.show);

//transaction [post]
router.post('/transaction', transaction.searchforTrans);

//Orders [get]
router.get('/orders', transaction.showorders);
router.get('/orders/:trans_id', transaction.specifictransorders);
router.get('/orders/:trans_id/:product_id/updateStatus', transaction.updateStatus);
router.get('/waitingOrders', transaction.waiting);
router.get('/OnGoing', transaction.ongoing);
router.get('/Finished', transaction.finished);


//Loginpanel [get] [post]
router.get('/account/change-password', adminLoginPanel.changpassword)
router.post('/account/change-password/update', adminLoginPanel.updatepassword)
router.get('/', adminLoginPanel.login);


module.exports = router;