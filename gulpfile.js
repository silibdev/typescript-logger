/**
 * typescript-logger Gulpfile
 */

var fs = require('fs'),
    gulp = require('gulp'),
    path = require('path'),
    del = require('del'),
    runSequence = require('run-sequence'),
    plugins = require('gulp-load-plugins')({lazy: true}),
    tsProject = plugins.typescript.createProject('tsconfig.json');

/*
 * Paths
 */
var paths = {
     assets: {
         src: [
            'src/**/*.html',
            'src/**/*.js',
            'src/**/*.json'
        ]
    },
    build: "build",
    tmp: "tmp"
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
        'logs',
        'clean',
        'tsc',
        done
    );
});

/* ------------------------------------------------------------------------------------------------------------------ */

// logs
gulp.task('logs', function(done) {
    plugins.util.log(plugins.util.colors.white('BUILDING'), ':', plugins.util.colors.green('typescript-logger'));
    done();
});

gulp.task('clean:build', function () {
    del.sync(paths.build);
});

gulp.task('clean:tmp', function () {
    del.sync(paths.tmp);
});

gulp.task('clean', function (done) {
    runSequence('clean:tmp','clean:build',done);
});

// typescript
gulp.task('tsc', function () {
    return gulp.src('src/**/*.ts')
        .pipe(plugins.sourcemaps.init())
        .pipe(tsProject())
        .pipe(plugins.sourcemaps.write('/'))
        .pipe(gulp.dest(dest));
});