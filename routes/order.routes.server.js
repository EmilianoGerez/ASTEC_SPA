var express = require('express');
var router = express.Router();
var controller = require('../controllers/order.controller.server');

// create
router.post('/', controller.create);
// update
router.put('/:id', controller.update);
// detail
router.get('/:id', controller.findOne);
// list pendig orders
router.get('/', controller.findAll);
// remove
router.delete('/:id', controller.remove);
// search
router.post('/search', controller.findBySearch);

module.exports = router;