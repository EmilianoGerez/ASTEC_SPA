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
		name: String
	}, 
	status: {
		type: String,
		required: true,
		enum: ['pending', 'canceled', 'assigned', 'completed'],
		default: 'pending'
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
		type: Boolean,
		default: false
	},
	dateCreated: {
		type: Date,
		default: Date.now
	},
	dateComplete: Date
});

orderSchema.pre('save', function(next) {
    var self = this;
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
});

module.exports = mongoose.model('Order', orderSchema);