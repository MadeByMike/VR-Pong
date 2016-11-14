var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var prefix_opts = {
  browsers: ['last 5 versions', '> 3%']
};

var sass_opts = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function () {
  return gulp
    .src('scss/styles.scss')
    .pipe(sass(sass_opts).on('error', sass.logError))
    .pipe(autoprefixer(prefix_opts))
    .pipe(gulp.dest('site-assets/'));
});

gulp.task('default', ['sass']);

var sass_watch = gulp.watch('scss/**/*.scss', ['sass']);
sass_watch.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type);
});
