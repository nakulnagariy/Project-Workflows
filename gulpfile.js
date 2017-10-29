var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat');

var coffeeSourses = ['components/coffee/tagline.coffee'];

var jsSourses = [
	'components/scripts/pixgrid.js',
	'components/scripts/rclick.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
	];

var sassSourses = ['components/sass/style.scss'];

gulp.task('coffee', function() {
	gulp.src(coffeeSourses)
		.pipe(coffee({ bare: true })
			.on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
	gulp.src(jsSourses)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulp.dest('builds/development/js'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {
	gulp.src(sassSourses)
		.pipe(compass({
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('builds/development/css'))
		.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch(coffeeSourses, ['coffee']);
	gulp.watch(jsSourses, ['js']);
	gulp.watch('components/sass/*', ['compass']);
});

gulp.task('connect', function() {
	connect.server({
		root: 'builds/development/',
		livereload: true
	});
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);