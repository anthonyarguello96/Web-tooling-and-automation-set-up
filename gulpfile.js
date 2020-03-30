const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const eslint = require('gulp-eslint');
const jasmineBrowser = require('gulp-jasmine-browser');
const watch = require('gulp-watch');


gulp.task('default', () => {
  gulp.watch('sass/**/*.scss', gulp.series('styles', reload));
  gulp.watch('js/**/*.js', gulp.series('lint', reload));
  browserSync.init({
    server: './',
  });
  gulp.watch('*.html').on('change', reload);
  gulp.watch('js/**/*.js').on('change', reload);
});


gulp.task('styles', () => {
  return gulp.src('sass/**/*.scss')
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(
          autoprefixer({
            browserlist: ['last 2 versions'],
          }))
      .pipe(gulp.dest('./css'))
      .pipe(browserSync.stream());
});

gulp.task('lint', () => {
  return gulp.src(['js/**/*.js'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
      .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError());
});


gulp.task('jasmine', () => {
  const filesForTest = ['js/**/*.js', 'spec/**/*_spec.js'];
  return gulp.src(filesForTest)
      .pipe(watch(filesForTest))
      .pipe(jasmineBrowser.specRunner())
      .pipe(jasmineBrowser.server({port: 8888}));
});
