var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Counter = mongoose.model('Counter');


var orderSchema = new Schema({
	number: {
		type: String,
		unique: true
	},
	client: {
		type: Schema.ObjectId,
		ref: 'Client',
		required: true
	},
	tech: {
		id: String,
		firstName: String,
		lastName: String
	},
	status: {
		type: String,
		required: true,
		enum: ['Ingresada', 'Cancelada', 'Asignada', 'Completada'],
		default: 'Asignada'
	},
	problem: {
		type: String,
		required: true
	},
	solution: {
		type: String
	},
	observation: String,
	solved: {
		type: String,
		enum: ['No', 'Si'],
		default: 'No'
	},
	dateCreated: {
		type: Date,
		default: Date.now
	},
	dateComplete: Date
});

orderSchema.pre('save', function(next) {
	var self = this;
	if (!self.dateComplete) {
		Counter.findByIdAndUpdate({
			_id: 'OrderId'
		}, {
			$inc: {
				seq: 1
			}
		}, function(err, count) {
			//console.log(count);
			if (err) return next(err);
			self.number = count.seq;
			next();
		});
	} else {
		next();
	}
});

module.exports = mongoose.model('Order', orderSchema);