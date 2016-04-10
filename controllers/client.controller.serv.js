var mongoose = require('mongoose');
var Client = mongoose.model('Client');
var Order = mongoose.model('Order');
var async = require('async');


exports.create = function(req, res) {
	var newClient = new Client(req.body);

	newClient.save(function(err, client) {
		if (err) {
			res.status(500).send(err.message);
		}

		res.status(201).jsonp(client);
	});
};

exports.findOne = function(req, res) {
	async.waterfall([
		function getClient(callback) {
			Client.findById(req.params.id).exec(function(err, client) {
				if (err) {
					callback(err, null);
				}

				callback(null, client);
			});
		},
		function getOrders(client, callback) {
			Order.find({
				'client': client._id
			}, function(err, orders) {
				if (err) {
					callback(err, null);
				}
				var clientOrders = {
					'client': client,
					'orders': orders
				};

				callback(null, clientOrders);
			});
		}
	], function(err, clientOrders) {
		if (err) {
			res.status(500).send(err.message);
		}
		res.status(200).jsonp(clientOrders);
	});
};

exports.findBySearch = function(req, res) {
	if (req.body.lastName) {
		Client.find({
			'lastName': req.body.lastName
		}).exec(function(err, clients) {
			if (err) {
				res.status(500).send(err.message);
			}

			res.status(200).jsonp(clients);
		});
	} else if (req.body.number) {
		Client.find({
			'number': req.body.number
		}).exec(function(err, clients) {
			if (err) {
				res.status(500).send(err.message);
			}

			res.status(200).jsonp(clients);
		});
	} else {
		res.status(404).jsonp({
			'message': 'No se encontraron resultados'
		});
	}
};

exports.update = function(req, res) {
	Client.findById(req.params.id).exec(function(err, client) {
		if (err) {
			res.status(500).send(err.message);
		}

		client.number = req.body.number;
		client.dni = req.body.dni;
		client.firstName = req.body.firstName;
		client.lastName = req.body.lastName;
		client.state = req.body.state;
		client.city = req.body.city;
		client.address = req.body.address;
		client.phone = req.body.phone;
		client.cellphone = req.body.cellphone;

		client.save(function(err) {
			if (err) {
				res.status(500).send(err.message);
			}

			res.status(200).jsonp(client);
		});
	});
};

exports.remove = function(req, res) {
	async.waterfall([

		function getOrders(callback) {
			Order.find({
				'client': req.params.id
			}, function(err, orders) {
				if (err) {
					callback(err, null);
					return;
				}

				callback(null, orders);
			});
		},

		function removeOrders(orders, callback) {
			var arrayId = createArray(orders);
			Order.remove({
				"_id": {
					"$in": arrayId
				}
			}, function(err) {
				if (err) {
					callback(err, null);
					return;
				}

				callback();
			});
		},

		function revoceClient(callback) {
			Client.remove({
				"_id": req.params.id
			}, function(err) {
				if (err) {
					callback(err, null);
					return;
				}
				callback();
			});
		}

	], function(err) {
		if (err) {
			res.status(500).send(err.message);
		}
		return res.status(204).jsonp({
			'message': 'Cliente eliminado'
		});
	});

};

function createArray(orders) {
	var arrayId = [];
	orders.forEach(function(e) {
		arrayId.push(e._id);
	});
	return arrayId;
}