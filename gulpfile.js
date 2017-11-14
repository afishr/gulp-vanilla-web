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
			html: 'src/public/_src/**/[^_]*.html',
			script: 'src/public/_src/js/**/[^_]*.*',
			style: 'src/public/_src/sass/**/[^_]*.*',
			img: 'src/public/_src/img/**/*.*'
		},
		dev: {
			html: 'src/public/',
			script: 'src/public/js/',
			style: 'src/public/css/',
			img: 'src/public/img'
		},
		dist: {
			html: 'build/public/',
			script: 'build/public/js/',
			style: 'build/public/css/',
			img: 'build/public/img'
		},
		watch: {
			html: 'src/public/_src/**/*.html',
			script: 'src/public/_src/js/**/*.*',
			style: 'src/public/_src/sass/**/*.*',
			img: 'src/public/_src/img/**/*.*'
		}
	},
	devServerConfig = {
		server: {
			baseDir: "./src/"
		},
		open: false,
		notify: false,
		tunnel: false,
		host: 'localhost',
		port: 1999,
		logPrefix: "BS"
	},
	prodServerConfig = {
		server: {
			baseDir: "./build/"
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
		.pipe(gulp.dest(paths.dev.html));
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
		.pipe(gulp.dest(paths.dev.style));
});

/* Script-dev-Build */
gulp.task('script-dev-build', function() {
	gulp.src(paths.src.script)
		.pipe(sourcemap.init())
		.pipe(rigger())
		.pipe(sourcemap.write())
		.pipe(gulp.dest(paths.dev.script));
});

/* Images-dev-Build */
gulp.task('img-dev-build', function() {
	gulp.src(paths.src.img)
		.pipe(newer(paths.src.img))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(paths.dev.img));
});

/*Productin build*/
/* Deploy */
gulp.task('deploy', function() {
	gulp.src(['src/**/*.*', '!src/public/{_src,_src/**}', '!src/public/{js,css,**/*.html}', '!src/public/{js/**,css/**}'])
	.pipe(gulp.dest('build/'));
});

/* HTML-prod-Build */
gulp.task('html-prod-build', function() {
	gulp.src(paths.src.html)
		.pipe(rigger())
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyCSS: true,
			minifyJS: true
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
	browserSync.init(devServerConfig);
});

/* Watch */
gulp.task('watch', function() {
	gulp.watch(paths.watch.html, ['html-dev-build', browserSync.reload])
	gulp.watch(paths.watch.style, ['style-dev-build', browserSync.reload])
	gulp.watch(paths.watch.script, ['script-dev-build', browserSync.reload])
	gulp.watch(paths.watch.img, ['img-dev-build', browserSync.reload])
});

/* Build */
gulp.task('prod', [
  'deploy',
	'html-prod-build',
	'style-prod-build',
	'script-prod-build'
]);

gulp.task('dev', [
	'html-dev-build',
	'style-dev-build',
	'script-dev-build',
	'img-dev-build'
]);

/* Default */
gulp.task('default', ['dev', 'server', 'watch']);
