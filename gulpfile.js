// Enable ESM syntax for the entire Gulpfile
require = require('esm')(module);

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');

// Development Tasks
function compileSass() {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css'));
}

// Gulp task to minify CSS files dynamically
function minifyDynamicCss() {
  return gulp.src(['./assets/css/**/*.css', '!css/**/*.min.css'])
    // It compiles SASS or SCSS files into CSS
    .pipe(sass({
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))

    /* Adds necessary vendor prefixes based on the rules defined by Can I Use */
    .pipe(autoprefixer())

    /* CSS and performs various optimizations to reduce file size */
    .pipe(csso())

    /*
      Beyond simple minification by performing additional optimizations
      like removing redundant rules, merging duplicate selectors, and more.
    */
    .pipe(cleanCss())

    .pipe(rename({ suffix: '.min' })) // Add '.min' to the filename
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css'));
}

// Watchers
function watch() {
  gulp.watch('./assets/scss/**/*.scss', compileSass);
}

// Gulp task to minify JavaScript files
function minifyJs() {
  return gulp.src([
    'js/global.js'
  ])
    .pipe(concat('bundle.min.js'))
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true
    }))
    .pipe(gulp.dest('js'));
}

// Define tasks
exports.sass = compileSass;
exports.minifycss = minifyDynamicCss;
exports.watch = watch;
exports.minifyjs = minifyJs;

// Default task
exports.default = gulp.parallel(compileSass, minifyDynamicCss, minifyJs, watch);
