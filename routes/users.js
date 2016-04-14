var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.server.controller');


router.post('/signup', userController.signup);

router.get('/signup', userController.findAll);

router.get('/signup/:id', userController.findOne);

router.post('/signin', userController.signin);

router.get('/logout/:id', userController.isAuth, userController.logout);

router.post('/refresh', userController.refresh);

router.get('/search/:email', userController.isAvailable);

router.get('/secure', userController.isAuth, function(req, res) {
	res.status(200).json({
		message: "You have access"
	});
});

router.get('/admin', userController.isAuth, userController.isAdmin, function(req, res) {
	res.status(200).json({
		message: "You have admin access"
	});
});

module.exports = router;