'use strict';

var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	htmlmin = require('gulp-htmlmin'),
	sass = require('gulp-sass'),
	newer = require('gulp-newer'),
	sourcemap = require('gulp-sourcemaps'),
	paths = {
		src: {
			html: 'app/_src/**/[^_]*.html',
			script: 'app/_src/js/**/[^_]*.*',
			style: 'app/_src/sass/**/[^_]*.*',
			img: 'app/_src/img/**/*.*',
			font: 'app/_src/fonts/**/*.*',
		},
		dist: {
			html: 'app/.',
			script: 'app/js/',
			style: 'app/css/',
			img: 'app/img',
			font: 'app/fonts/',
		},
		watch: {
			html: 'app/src/**/*.html',
			script: 'app/src/js/*.*',
			style: 'app/src/sass/*.*',
			img: 'app/src/**/*.*',
			font: 'app/src/fonts/**/*.*'
		}
	},
	serverConfig = {
		server: {
			baseDir: "./app/"
		},
		open: false,
		notify: false,
		tunnel: false,
		host: 'localhost',
		port: 1999,
		logPrefix: "BS"
	}

/* Dev build*/
/* HTML-dev-Build */
gulp.task('html-dev-build', function() {
	gulp.src(paths.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(paths.dist.html));
});


/* Style-dev-Build */
gulp.task('style-dev-build', function() {
	gulp.src(paths.src.style)
		.pipe(sourcemap.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(prefixer({
			browsers: ['last 5 versions', 'IE 8'],
			add: true,
			cascade: false,
			remove: false
		}))
		.pipe(sourcemap.write())
		.pipe(gulp.dest(paths.dist.style));
});

/* Script-dev-Build */
gulp.task('script-dev-build', function() {
	gulp.src(paths.src.script)
		.pipe(sourcemap.init())
		.pipe(rigger())
		.pipe(sourcemap.write())
		.pipe(gulp.dest(paths.dist.script));
});

/* Images-dev-Build */
gulp.task('img-dev-build', function() {
	gulp.src(paths.src.img)
		.pipe(newer(paths.dist.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(paths.dist.img));
});

/* Fonts-dev-Build */
gulp.task('fonts-dev-build', function() {
	gulp.src(paths.src.font)
		.pipe(newer(paths.dist.font))
		.pipe(gulp.dest(paths.dist.font));
});

/*Productin build*/
/* HTML-prod-Build */
gulp.task('html-prod-build', function() {
	gulp.src(paths.src.html)
		.pipe(rigger())
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest(paths.dist.html));
});


/* Style-prod-Build */
gulp.task('style-prod-build', function() {
	gulp.src(paths.src.style)
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(prefixer({
			browsers: ['last 5 versions', 'IE 8'],
			add: true,
			cascade: false,
			remove: false
		}))
		.pipe(cssmin())
		.pipe(gulp.dest(paths.dist.style));
});

/* Script-prod-Build */
gulp.task('script-prod-build', function() {
	gulp.src(paths.src.script)
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist.script));
});

/*Common*/
/* WebServer */
gulp.task('server', function() {
	browserSync.init(serverConfig);
});

/* Watch */
gulp.task('watch', function() {
	gulp.watch(paths.watch.html, ['html-dev-build', browserSync.reload])
	gulp.watch(paths.watch.style, ['style-dev-build', browserSync.reload])
	gulp.watch(paths.watch.script, ['script-dev-build', browserSync.reload])
	gulp.watch(paths.watch.img, ['img-dev-build', browserSync.reload])
	gulp.watch(paths.watch.fonts, ['fonts-dev-build', browserSync.reload])
});

gulp.task('prod', [
	'html-prod-build',
	'style-prod-build',
	'script-prod-build'
]);

/* Build */
gulp.task('dev', [
	'html-dev-build',
	'style-dev-build',
	'script-dev-build',
	'img-dev-build',
	'fonts-dev-build'
]);

/* Default */
gulp.task('default', ['dev', 'server', 'watch']);
