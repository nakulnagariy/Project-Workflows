var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat');

var env,
	coffeeSourses,
	jsSourses,
	htmlSourses,
	jsonSourses,
	sassSourses,
	sassStyle,
	outputDir;

env = process.env.NODE_ENV || 'development';
//env = 'production';

if (env==='development') {
	outputDir = 'builds/development';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production';
	sassStyle = 'compressed';
}



coffeeSourses = ['components/coffee/tagline.coffee'];
jsSourses = [
	'components/scripts/pixgrid.js',
	'components/scripts/rclick.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
	];

htmlSourses = [outputDir + '/*.html'];
jsonSourses = [outputDir + '/js/*.json'];
sassSourses = ['components/sass/style.scss'];

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
		.pipe(gulpif(env==='production', uglify()))
		.pipe(gulp.dest(outputDir + '/js'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {
	gulp.src(sassSourses)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + '/images',
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + '/css'))
		.pipe(connect.reload())
});

gulp.task('html', function() {
	gulp.src(htmlSourses)
		.pipe(connect.reload())
});

gulp.task('json', function() {
	gulp.src(jsonSourses)
		.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch(coffeeSourses, ['coffee']);
	gulp.watch(jsSourses, ['js']);
	gulp.watch('components/sass/*', ['compass']);
	gulp.watch(htmlSourses, ['html']);
	gulp.watch(jsonSourses, ['json']);
});

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('default', ['coffee', 'js', 'compass', 'html', 'connect', 'watch']);