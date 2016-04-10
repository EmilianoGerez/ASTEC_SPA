// Gulp
var gulp = require('gulp');

// Dependencies minify
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Nodemon server dependencies
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');

// Dependencies angular task
var sourcemaps = require('gulp-sourcemaps');
var rimraf = require('rimraf');

// Dependencies sass / styles task
var sass = require('gulp-sass');


var inputFiles = {
    //angular: './public/modules/**/*.js',
    html: './client/modules/**/*.html',
    sass_watch: './client/assets/css/*.scss',
    styles: './client/assets/css/styles.scss',
    angular: './client/modules/**/*.js'
};
var outputFiles = {
    angular: './client/dist/angular',
    css: './client/dist/css'
};


// Server
gulp.task('nodemon', function(cb) {

    var started = false;

    return nodemon({
        script: './bin/www'
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["client/modules/**/*.html"],
        browser: "mozilla firefox",
        port: 7000,
    });
});


// Config tasks
gulp.task('build-angular', ['clean-angular'], function() {
    return gulp.src(inputFiles.angular)
        .pipe(sourcemaps.init())
        .pipe(concat('compress.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputFiles.angular))
        .pipe(browserSync.stream());
});

// Clean
gulp.task('clean-angular', function(cb) {
    rimraf(outputFiles.angular + '/' + 'compress.min.js', cb);
});
gulp.task('clean-styles', function(cb) {
    rimraf(outputFiles.css + '/' + 'styles.css', cb);
});

// Sass compilation
gulp.task('styles', ['clean-styles'], function() {
    gulp.src(inputFiles.styles)
        .pipe(sass().on('error', notify.onError(function(error) {
            return "Problem file : " + error.message;
        }))
    )
        .pipe(gulp.dest(outputFiles.css))
        .pipe(browserSync.stream());
});

// Watch
gulp.task('watch', function() {
    gulp.watch(inputFiles.angular, ['build-angular']);
    gulp.watch(inputFiles.sass_watch, ['styles']);
});

// Default
gulp.task('default', ['build-angular', 'styles', 'nodemon', 'browser-sync', 'watch']);
