const gulp = require("gulp");
const sass = require ("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");


gulp.task("default", function(){
  gulp.watch("sass/**/*.scss", gulp.series('styles'));
});

gulp.task("styles", function(){
  return gulp.src("sass/**/*.scss")
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(
      autoprefixer({
        browserlist: ["last 2 versions"]
      }))
    .pipe(gulp.dest("./css"));
});
