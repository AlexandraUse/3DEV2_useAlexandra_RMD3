// User schema
module.exports = function(mongoose){
	var schema = mongoose.Schema({
		username: {type: String, required: true, unique: true},
		character: {type: String, required: true, unique: true}
	});

	return mongoose.model("User", schema);
};
