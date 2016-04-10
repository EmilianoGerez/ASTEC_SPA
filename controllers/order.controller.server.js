var mongoose = require('mongoose');
var Order = mongoose.model('Order');

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
		'status': 'pending'
	}).exec(function(err, orders) {
		if (err) {
			res.status(500).send(err.message);
		}

		res.status(200).jsonp(orders);
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
	if (req.body.number) {
		Order.find({
			'number': req.body.number
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
		order.dateComplete = req.body.dateComplete;

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