// main page
module.exports = function(app, auth, util, User){

	app.get("/login", function(req, res){
		res.render("login", {title: "Login"});
	});

	app.get("/register", function(req, res){
		res.render("register", {title: "Register"});
	});

	app.post("/register", function(req, res){
		//console.log(req.body);
		var post = req.body;
		var errors = auth.validate(post);
		if(util.isEmpty(errors)){
			//res.send(post);
			var user = new User(post);
			user.save(function(err){
				if(err){
					var error = "Couldn't register user";
					if(err.code === 11000){
						error = "User already exists";
					}
					res.render("register", {error: error, title: "Register"});
				}else{
					res.redirect("/");
				}
			});
		}else{
			res.send(errors);
		}
	});
};
