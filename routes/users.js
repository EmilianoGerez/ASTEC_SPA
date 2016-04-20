var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.server.controller');


router.post('/', userController.signup);

router.get('/', userController.isAuth, userController.findAll);

router.get('/:id', userController.isAuth, userController.findOne);

router.put('/:id', userController.isAuth, userController.update);

router.delete('/:id', userController.isAuth, userController.remove);

router.post('/signin', userController.signin);

router.get('/logout/:id', userController.isAuth, userController.logout);

router.post('/refresh', userController.isAuth, userController.refresh);

router.get('/search/:email', userController.isAvailable);

module.exports = router;