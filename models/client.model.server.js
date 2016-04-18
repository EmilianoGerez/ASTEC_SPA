var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
	number: {
		type: Number,
		required: true,
		unique: true
	},
	dni: {
		type: Number,
		unique: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: false
	},
	cellphone: {
		type: String,
		required: false
	}
});

module.exports = mongoose.model('Client', clientSchema);