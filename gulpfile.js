/* globals __dirname: true */

var gulp = require("gulp");
var path = require("path");
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var main_bower_files = require('main-bower-files');

var config = require('./config.json');

var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

function getFilePath(target,type){
	return config[type][target].folder + "/" + config[type][target].file;
}

var scripts = [
	"**/*.js",
	"!node_modules/**/*.js",
	"!public/**/*.js",
	"!js/**/*.js",
	"!bower_components/**/*.js"
];

gulp.task('stylesheets', function() {
	return gulp.src([getFilePath("src","stylesheets"),'!_scss/_reset.scss'])
							.pipe(plugins.plumber())
							.pipe(plugins.scssLint())
							.pipe(plugins.sass({
								includePaths: [config.stylesheets.src.folder]
							}))
							.pipe(plugins.autoprefixer({
								browsers: ['Last 2 versions','ie 9'],
								cascade: false
							}))
							.pipe(plugins.util.env.type === 'production' ? plugins.minifyCss() : plugins.util.noop())
							.pipe(plugins.filesize())
							.pipe(gulp.dest(config.stylesheets.dest.folder));
});

function browserify_file(file){

	function rebundle(){

		return bundler.bundle()
			.on('error', function(error){
				console.log(error);
				this.emit("end");
			})
			.pipe(source(path.basename(file)))
			.pipe(buffer())
			.pipe(plugins.util.env.type === 'production' ? plugins.uglify() : plugins.util.noop())
			.pipe(plugins.filesize())
			.pipe(gulp.dest(config.scripts.dest.folder));
	}

	var bundler = watchify(browserify(file, watchify.args));
	bundler.on('update', rebundle);

	return rebundle();
}

gulp.task("scripts",function(){
	return gulp.src(getFilePath('src','scripts'))
					.pipe(plugins.tap(function(file){
						return browserify_file("./" + path.relative(__dirname, file.path));
					}));
});

gulp.task("vendor", function(){

  var js_filter = plugins.filter(['*.js']);
  var css_filter = plugins.filter(['*.css']);
  var fonts_filter = plugins.filter(['*.ttf','*.eot','*.svg','*.woff']);

	return gulp.src(main_bower_files())
							.pipe(js_filter)
							.pipe(plugins.uglify())
							.pipe(plugins.concat(config.vendor.dest.file))
							.pipe(gulp.dest(config.scripts.dest.folder))
							.pipe(js_filter.restore())
							.pipe(css_filter)
							.pipe(plugins.minifyCss())
							.pipe(gulp.dest(config.stylesheets.dest.folder))
							.pipe(css_filter.restore())
							.pipe(fonts_filter)
							.pipe(gulp.dest(config.fonts.dest.folder));

});

gulp.task("components", function(){
	return gulp.src(config.components.src.folder + "/" + config.components.src.templates)
							.pipe(plugins.tap(function(file){
								var path = file.path.split("/");
								file.base += path[path.length-2];
							}))
							.pipe(plugins.smoosher())
							.pipe(gulp.dest(config.components.dest.folder + "/"));
});

gulp.task("hinting", function(){
	return gulp.src(scripts)
							.pipe(plugins.plumber())
							.pipe(plugins.jshintCached("./.jshintrc"))
							.pipe(plugins.jshintCached.reporter('jshint-stylish'))
							.pipe(plugins.jshintCached.reporter("fail"))
							.on('error', function(error){
								plugins.util.beep();
								this.emit("end");
							});
});

var nodemon_ignore = [
	"public/**",
	"_js/**",
	"_components/**",
	"node_modules/**",
	"gulpfile.js",
	"bower_components/**"
];

gulp.task("server",function(){
	plugins.nodemon({script: ".", ignore: nodemon_ignore});
});

gulp.task("database", function(){
	require('child_process').exec("mongod", function(err,stdout,stderr){
		console.log(stdout);
	});
});

gulp.task('watch', function() {
	gulp.watch(getFilePath('src','vendor'), ['vendor']);
	gulp.watch(getFilePath("src","stylesheets"), ['stylesheets']);
	gulp.watch(getFilePath("src","scripts"), ['scripts']);
	gulp.watch(config.components.src.folder + "/" + config.components.src.all, ['components']);
	gulp.watch(scripts, ['hinting']);
});

gulp.task('default', ['watch','stylesheets','hinting', 'vendor', 'scripts','components','server','database']);
