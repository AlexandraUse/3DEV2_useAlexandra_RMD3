/* globals process:true */

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV || "development";

var express = require("express");
var app = express();
var server = require('http').Server(app);

//** CONFIG **//
require("./config/middleware.js")(app, express);
require("./config/handlebars.js")(app);
var mongoose = require("./config/mongoose.js")();

//** MODULES **//
require("./modules/server.js")(server);
var auth = require("./modules/auth.js");
var util = require("./modules/util.js");

//** ROUTES **//
require("./controllers/pages.js")(app);
require("./controllers/api.js")(app, mongoose.models);
require("./controllers/auth.js")(app, auth, util, mongoose.models.User);

server.listen(port, function() {
  console.log('Server listening at port', port, 'in', env, 'mode');
});
