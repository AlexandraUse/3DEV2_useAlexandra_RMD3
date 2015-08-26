// main page
module.exports = function(app){

	app.get("/", function(req, res){
		res.render("index", {title: "Home"});
	});

	app.get("/app", function(req, res){
		res.redirect("/");
	});
};
