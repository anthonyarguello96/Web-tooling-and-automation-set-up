const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('default', function() {
  gulp.watch('sass/**/*.scss', gulp.series('styles', reload));
  browserSync.init({
    server: './',
  });
  gulp.watch('*.html').on('change', reload);
  gulp.watch('js/**/*.js').on('change', reload);
});


gulp.task('styles', function() {
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
