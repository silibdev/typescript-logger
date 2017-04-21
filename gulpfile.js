/**
 * typescript-logger Gulpfile
 */

var gulp = require('gulp'),
    del = require('del'),
    runSequence = require('run-sequence'),
    plugins = require('gulp-load-plugins')({lazy: true}),
    tsProject = plugins.typescript.createProject('tsconfig.json');
    tsIndex = require('gulp-typescript');

/*
 * Paths
 */
var paths = {
    build: "build",
    index: "./"
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
        .pipe(tsIndex({
            module: "commonjs",
            target: "es5",
            suppressImplicitAnyIndexErrors: true,
            noImplicitAny: true,
            sourceMap: true,
            declaration: true
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('tsc:src', function () {
    return gulp.src('src/**/*.ts')
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject())
        .pipe(plugins.sourcemaps.write('/'))
        .pipe(gulp.dest(dest));
});