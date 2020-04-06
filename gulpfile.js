const gulp = require('gulp');
const {series} = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const eslint = require('gulp-eslint');
const jasmineBrowser = require('gulp-jasmine-browser');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
// const watch = require('gulp-watch');


function watch() {
  browserSync.init({
    server: './dist',
  });
  gulp.watch('sass/**/*.scss', gulp.parallel(styles));
  gulp.watch('sass/**/*.scss').on('change', reload);
  gulp.watch('js/**/*.js', gulp.series(lint));
  gulp.watch('js/**/*.js').on('change', reload);
  gulp.watch('index.html', gulp.parallel(copyHtml));
  gulp.watch('*.html').on('change', reload);
  gulp.watch('img/*', gulp.parallel(copyImages));
  gulp.watch('img/*').on('change', reload);
}


function styles(cb) {
  gulp.src('sass/**/*.scss')
      .pipe(sass({outputStyle: 'compressed'}))
      .on('error', sass.logError)
      .pipe(
          autoprefixer({
            browserlist: ['last 2 versions'],
          }))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
  cb();
}


function lint(cb) {
  gulp.src(['js/**/*.js'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
      .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError());
  cb();
}


gulp.task('jasmine', function() {
  return gulp.src(['js/**/*.js', 'spec/**/*_spec.js'])
      .pipe(jasmineBrowser.specRunner())
      .pipe(jasmineBrowser.server({port: 8888}));
});


function copyHtml(cb) {
  gulp.src('index.html')
      .pipe(gulp.dest('dist'));
  cb();
}


function copyImages(cb) {
  gulp.src('img/')
  // note1: Just make sure the files inside img are being copy properly
  // I think it might need a wildcard (*) to pull the files
      .pipe(gulp.dest('dist/img'));
  cb();
}


function scripts() {
  return gulp.src('js/**/*.js')
      .pipe(babel())
      .pipe(concat('all.js'))
      .pipe(gulp.dest('dist/js'));
}


function scriptsDist() {
  return gulp.src('js/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('all.js'))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/js'));
}

function dist(cb) {
  series(copyHtml, copyImages, styles, lint, scriptsDist);
  cb();
}


exports.copyHtml = copyHtml;
exports.copyImages = copyImages;
exports.styles = styles;
exports.lint = lint;
exports.scripts = scripts;
exports.scriptsDist = scriptsDist;
exports.dist = dist;
exports.default =series(styles, watch, lint,
    copyHtml, copyImages, 'jasmine');
// Notes:
// note1: Keep an eyeon the function copyImages and its path.
