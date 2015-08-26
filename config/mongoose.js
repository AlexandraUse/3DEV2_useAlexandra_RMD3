// mongoose config
/* globals process: true */

module.exports = function(){
	var mongoose = require("mongoose");
	var mongodb_url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/devineroulette2";

	mongoose.connect(mongodb_url);

	var models_path = "../models/";
	require(models_path + "User.js")(mongoose);

	return mongoose;
};

// register schemas
