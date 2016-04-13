var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/panel', function(req, res, next) {
  res.render('admin-app');
});

router.get('/signup', function(req, res, next) {
  res.render('public-signup');
});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});


module.exports = router;
