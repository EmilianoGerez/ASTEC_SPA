var express = require('express');
var router = express.Router();
var controller = require('../controllers/order.controller.server');
var userController = require('../controllers/user.server.controller');

// create
router.post('/', userController.isAuth, controller.create);
// update
router.put('/:id', userController.isAuth, controller.update);
// detail
router.get('/:id', userController.isAuth, controller.findOne);
// list pendig orders
router.get('/', userController.isAuth, controller.findAll);
// all orders {paginated}
router.get('/vieworders/:year/month/:startMonth/:endMonth', userController.isAuth, controller.viewOrders);
// remove
router.delete('/:id', userController.isAuth, controller.remove);
// remove
router.delete('/:id/search/:number/:lastName', userController.isAuth, controller.remove);
// search (send one params set to null)
router.get('/search/:number/:lastName', userController.isAuth, controller.findBySearch);

module.exports = router;