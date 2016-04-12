var express = require('express');
var router = express.Router();
var controller = require('../controllers/client.controller.serv');

// create
router.post('/', controller.create);
// update
router.put('/:id', controller.update);
// detail
router.get('/:id', controller.findOne);
// remove
router.delete('/:id/search/:number/:lastName', controller.remove);
// search (send one params set to null)
router.get('/search/:number/:lastName', controller.findBySearch);

module.exports = router;