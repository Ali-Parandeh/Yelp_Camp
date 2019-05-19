var mongoose = require ("mongoose");
// Plugin for passport local strategy to connect to mongoose for storing user authentication information
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Include passport local mongoose methods as part of this User schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);