const gulp = require("gulp");
const sass = require ("gulp-sass");

gulp.task("default", function(){
  //Code for default task
});

gulp.task("styles", function(){
  return gulp.src("sass/**/*.scss")
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(gulp.dest("./css"));
});
