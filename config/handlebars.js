// handlebars config
module.exports = function(app){

	var express_handlebars = require("express-handlebars");
	var handlebars = express_handlebars.create({
		extname: ".hbs",
		defaultLayout: "main",
		partialsDir: "./views/partials/",
		helpers: {
			section: function(name, options){
				if(!this._sections){
					this._sections = {};
				}
				this._sections[name] = options.fn(this);
				return null;
			}
		}
	});

	app.engine("hbs", handlebars.engine);
	app.set("view engine", "hbs");
	app.set("views", "./views");

	return handlebars;
};
