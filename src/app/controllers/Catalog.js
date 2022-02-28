const Catalogs = require("../models/Catalog");
const { multipleMongooseToObject, moongoseToObject } = require("../../utility/mongoose");
const md5 = require('../../utility/md5');
const cookieParser = require("cookie-parser");


class Catalog {
  //[get] /admin/catalog
  show(req, res, next) {
    Catalogs.find({})
      .then(Catalogs => {
        res.render('product/catalog/catalog', {
          layout: 'admin',
          title: 'Catalog',
          username: req.cookies.username,
          Catalogs: multipleMongooseToObject(Catalogs)
        })
      })
      .catch(next);
  }

  //[get] admin/catalog/:id/delete
  delete(req, res, next) {
    Catalogs.deleteOne({
      _id: req.params.id
    })
    .then(() => {
      res.redirect('/admin/catalogs');
    })
    .catch(next);
  }

  //[get] admin/catalog/add
  add(req, res, next) {
    res.render('product/catalog/add', {
      layout: 'admin',
      title: 'Add new catalog',
      username: req.cookies.username
    })
  }

  //[post] /admin/catalogs/save
  save(req, res, next) {
    const formData = req.body;
    const Catalog = new Catalogs(formData);
    Catalog.save()
      .then(() => {
        res.redirect('/admin/catalogs');
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

  //[get] /admin/catalogs/:id/edit
  edit(req, res, next) {
    Catalogs.findById(req.params.id)
      .then(catalog => {
        res.render('product/catalog/edit', {
          layout: 'admin',
          username: req.cookies.username,
          title: 'Edit catalog',
          catalog: moongoseToObject(catalog)
        })
      })
      .catch(next);
  }

  //[post] /admin/catalogs/:id/update
  update(req, res, next) {
    Catalogs.updateOne(
      {
        _id: req.params.id
      }, 
      {
        name: req.body.name,
      }
    )
    .then(() => {
      res.redirect('/admin/catalogs');
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
}

module.exports = new Catalog();
