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
    build: "build"
};

/*
 * Set default gulp.dest folder
 */
var dest = paths.build;

/*
 * This task run in sequence all tasks needed to build files for release.
 * (npm run build)
 */
gulp.task('build', function (done) {
    // run sequence tasks
    runSequence(
        'clean',
        'tsc:index',
        'tsc:src',
        done
    );
});

gulp.task('clean', function () {
    del.sync(paths.build);
});

gulp.task('tsc:index', function () {
    return gulp.src('index.ts')
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