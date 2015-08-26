// api routes
module.exports = function(app, models){
	var base_path = "/api";

	app.get(base_path + "/users", function(req, res){
		models.User.find(function(err, users){
			res.send(users);
		});
	});

	app.get(base_path + "/users/:id", function(req, res){
		models.User.findOne({_id: req.params.id}, function(err, user){
			res.send(user);
		});
	});
};
