var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Skynet' });
});
router.get('/faltadepago', function(req, res) {
  res.render('payment');
});


module.exports = router;
