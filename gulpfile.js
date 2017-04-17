const gulp = require('gulp')
const webpack = require('gulp-webpack')
const browserSync = require('browser-sync')
const nodemon = require('gulp-nodemon')

require('dotenv').load();

gulp.task('js', function () {
	return gulp.src('src/index.js')
		.pipe(webpack( require('./webpack.config.js') ))
		.pipe(gulp.dest('.'))
		.pipe(browserSync.stream());
});

gulp.task('watch', function () {

	// watch CLIENT-SIDE js
	gulp.watch(['src/**/*.js'], ['js']);
	// trigger browserSync reload when HBS files change
	gulp.watch(['**/*.hbs'], browserSync.reload);

	return nodemon({

		script: 'app.js',

		// watch SERVER SIDE files
		// note we are NOT watching components even though most of these render
		// server-side as well.
		watch: ['app.js', 'models/**/*.js', 'routes/**/*.js']

	})
	.once('start', function() {
		browserSync.init({
			proxy: 'http://localhost:' + process.env.PORT,
			port: (parseInt(process.env.PORT, 10) + 1)
		});
	}).on('restart', browserSync.reload);

});
