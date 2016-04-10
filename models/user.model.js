var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Tech'],
        deafult: 'Tech'
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
