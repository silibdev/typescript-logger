/**
 * typescript-logger Gulpfile
 */

var gulp = require('gulp'),
    del = require('del'),
    runSequence = require('run-sequence'),
    plugins = require('gulp-load-plugins')({lazy: true}),
    tsProject = plugins.typescript.createProject('tsconfig.json'),
    ts = require('gulp-typescript'),
    webserver = require('gulp-webserver'),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    tsify = require("tsify");

/*
 * Paths
 */
var paths = {
    demo: 'demo',
    demoIndex: './demo/src/index.html',
    demoScripts: './demo/scripts',
    index: "./",
    build: "build"
};

/*
 * Set default gulp.dest folder
 */
var dest = paths.build;

/*
 * This task run in sequence all tasks needed to build files for release.
 */
gulp.task('build', function (done) {
    runSequence(
        'clean',
        'tsc',
        done
    );
});

gulp.task('demo', function (done) {
    runSequence(
        'tsc:demo',
        'serve:demo',
        done
    )
});

gulp.task('clean', function (done) {
    return runSequence(
        'clean:index',
        'clean:build',
        done
    )
});

gulp.task('tsc', function (done) {
    return runSequence(
        'tsc:src',
        'tsc:index',
        done
    )
});

gulp.task('clean:index', function () {
    del.sync(paths.index + '/index.js');
    del.sync(paths.index + '/index.d.ts');
});

gulp.task('clean:build', function () {
    del.sync(dest);
});

gulp.task('tsc:index', function () {
    return gulp.src(paths.index + '/index.ts')
        .pipe(ts({
            module: "commonjs",
            target: "es5",
            suppressImplicitAnyIndexErrors: true,
            noImplicitAny: true,
            sourceMap: true,
            declaration: true
        }))
        .pipe(gulp.dest(paths.index));
});

gulp.task('tsc:src', function () {
    return gulp.src('src/**/*.ts')
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject())
        .pipe(plugins.sourcemaps.write('/'))
        .pipe(gulp.dest(dest));
});

gulp.task('tsc:demo', function () {
    return browserify({
        basedir: './src',
        debug: true,
        entries: ['index.ts'],
        cache: {},
        packageCache: {},
        standalone: 'Bundle'
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('Logger.js'))
        .pipe(gulp.dest(paths.demoScripts));
});

gulp.task('serve:demo', function () {
    return gulp.src(paths.demo)
        .pipe(webserver({
            port: 8888,
            open: true,
            fallback: 'index.html'
        }))
});