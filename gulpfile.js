var gulp       = require('gulp');
var sass       = require('gulp-sass');

var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');

var csslint    = require('gulp-csslint');
var minifyCSS  = require('gulp-minify-css');

var rename     = require('gulp-rename');
var jshint     = require('gulp-jshint');
var concat     = require('gulp-concat');
var uglify     = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon    = require('gulp-nodemon');

var gzip = require('gulp-gzip');

gulp.task('css', function() {
  return gulp.src('public/assets/stylesheets/style.scss')
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(csslint())
    .pipe(csslint.reporter())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('js', function() {
  return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js', 'public/app/components/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  return gulp.src(['public/app/controllers/mainCtrl.js', 'public/app/services/authService.js', 'public/app/components/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('public/app/dist'));
});

gulp.task('angular', function() {
  return gulp.src(['public/app/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('public/app/dist'));
});

gulp.task('watch', function() {
  gulp.watch('public/assets/stylesheets/**/*.scss', ['css']);
  gulp.watch('public/assets/stylesheets/*.scss', ['css']);
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['js', 'angular']);
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js sass html'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function() {
      console.log('Restarted!');
    });
});

gulp.task('default', ['nodemon']);
