var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var Client = mongoose.model('Client');
var async = require('async');


exports.create = function(req, res) {
	var newOrder = new Order(req.body);

	newOrder.save(function(err, order) {
		if (err) {
			res.status(500).send(err.message);
		}

		res.status(201).jsonp(order);
	});
};

exports.findAll = function(req, res) {
	Order.find({
		'status': {
			'$in': ['Ingresada', 'Asignada']
		}
	}).populate('client').exec(function(err, orders) {
		if (err) {
			res.status(500).send(err.message);
		}

		Order.find({'status': 'Completada'}).sort('-dateComplete').limit(10).populate('client').exec(function(err, ordersComplete) {
			if (err) {
				res.status(500).send(err.message);
			}

			res.status(200).jsonp([orders, ordersComplete]);

		});

	});
};

exports.findOne = function(req, res) {
	Order.findById(req.params.id).populate('client').exec(function(err, order) {
		if (err) {
			res.status(500).send(err.message);
		}

		res.status(200).jsonp(order);
	});
};

exports.findBySearch = function(req, res) {

	if (req.params.lastName !== 'null') {

		async.waterfall([
			async.apply(getClients, req),
			getOrders
		], function(err, orders) {
			if (err) {
				res.status(500).send(err.message);
			}

			return res.status(200).jsonp(orders);
		});

	} else if (!isNaN(req.params.number)) {
		Order.find({
			'number': req.params.number
		}).populate('client').exec(function(err, orders) {
			if (err) {
				res.status(500).send(err.message);
			}

			res.status(200).jsonp(orders);
		});
	} else {
		res.status(404).jsonp({
			'message': 'No se encontraron resultados'
		});
	}
};

exports.update = function(req, res) {
	Order.findById(req.params.id).populate('client').exec(function(err, order) {
		if (err) {
			res.status(500).send(err.message);
		}

		order.tech = req.body.tech;
		order.status = req.body.status;
		order.problem = req.body.problem;
		order.solution = req.body.solution;
		order.observation = req.body.observation;
		order.solved = req.body.solved;
		order.dateComplete = new Date();

		order.save(function(err) {
			if (err) {
				res.status(500).send(err.message);
			}

			res.status(200).jsonp(order);
		});
	});
};

exports.remove = function(req, res) {
	Order.remove({
		'_id': req.params.id
	}, function(err) {
		if (err) {
			res.status(500).send(err.message);
		}
		res.status(204).jsonp({
			'message': 'Orden eliminada'
		});
	});
};

// functions helper
function getClients(req, callback) {
	Client.find({
		'lastName': {
			$regex: new RegExp("^" + req.params.lastName.toLowerCase(), "i")
		}
	}).exec(function(err, clients) {
		if (err) {
			callback(err, null);
			return;
		}
		callback(null, clients);
	});
}

function getOrders(clients, callback) {
	var arrayId = createArray(clients);

	Order.find({
		"client": {
			"$in": arrayId
		}
	}).populate('client').exec(function(err, orders) {
		if (err) {
			callback(err, null);
			return;
		}
		callback(null, orders);
	});
}

function createArray(clients) {
	var arrayId = [];
	clients.forEach(function(e) {
		arrayId.push(e._id);
	});
	return arrayId;
}