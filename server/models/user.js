// grab the things we need
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');

// create a schema
var userSchema = new Schema({
    username: {type: String, required: true},
    hash_password: {type: String, required: true}
}, {
    versionKey: false
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our User in our Node applications
module.exports = User;
