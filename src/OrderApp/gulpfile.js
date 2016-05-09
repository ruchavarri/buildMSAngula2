/// <binding Clean='clean' ProjectOpened='moveToLibs' />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    ts = require('gulp-typescript');

    //Refer's TypeScript Configuration file
    var tsProject = ts.createProject('tsconfig.json');

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.npmSrc = "./node_modules/";
paths.npmLibs = paths.webroot + "lib/npmlibs/";

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    return gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    return gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

var libsToMove = [
   paths.npmSrc + '/es6-shim/es6-shim.min.js',
   paths.npmSrc + '/zone.js/dist/zone.js',
   paths.npmSrc + '/reflect-metadata/Reflect.js'
];

gulp.task("copy-deps:systemjs", function () {
    return gulp.src(paths.npmSrc + '/systemjs/dist/**/*.*')
         .pipe(gulp.dest(paths.npmLibs + '/systemjs/'));
});

gulp.task("copy-deps:rxjs", function () {
    return gulp.src(paths.npmSrc + '/rxjs/**/*.js')
         .pipe(gulp.dest(paths.npmLibs + '/rxjs/'));
});


gulp.task("copy-deps:angular2", function () {
    return gulp.src(paths.npmSrc + '/@angular/**/*.js', { base: paths.npmSrc + '/@angular/' })
         .pipe(gulp.dest(paths.npmLibs + '/@angular/'));
});




gulp.task('moveToLibs:singleFiles', function () {
    return gulp.src(libsToMove).pipe(gulp.dest(paths.npmLibs));
});

//ts - task to transpile TypeScript files to JavaScript using Gulp-TypeScript 
gulp.task('ts', function (done) {
    var tsResult = gulp.src([
        "./wwwroot/js/*.ts"
    ])
      .pipe(ts(tsProject), undefined, ts.reporter.fullReporter());
    return tsResult.js.pipe(gulp.dest('wwwroot/js'));
});

//watch -- Task to watch for any changes under 'setup' and 'ts' tasks
gulp.task('watch', ['watch.ts']);

gulp.task('watch.ts', ['ts'], function () {
    return gulp.watch('./wwwroot/js/*.ts', ['ts']);
});

gulp.task("moveToLibs", ["moveToLibs:singleFiles", 'copy-deps:angular2', 'copy-deps:systemjs', 'copy-deps:rxjs']);