var pkg = require('./package.json'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  coveralls = require('gulp-coveralls'),
  del = require('del'),
  gulp = require('gulp'),
  header = require('gulp-header'),
  jshint = require('gulp-jshint'),
  karma = require('karma'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream'),
  uglify = require('gulp-uglify');

gulp.task('default', ['clean', 'lint', 'test', 'compile']);
gulp.task('dev', ['compile', 'lint', 'test', 'watch']);

gulp.task('watch', function() {
  gulp.watch('lib/**/*.js', ['test', 'lint', 'compile']);
  gulp.watch('test/spec/**/*.js', ['test']);
});

gulp.task('clean', function() {
  return del.sync(['dist', 'test/coverage']);
});

gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'lib/**/*.js', 'specs/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['clean'], function(done) {
  new karma.Server({ configFile: __dirname + '/karma.conf.js', singleRun: true })
    // prevent karma from calling process.exit
    .on('run_complete', function() { done(); })
    .start();
});

gulp.task('coveralls', ['test'], function() {
  return gulp.src(['test/coverage/**/lcov.info'])
    .pipe(coveralls());
});

gulp.task('compile', ['clean'], function() {
  return browserify('lib/bespoke-hash.js', { standalone: 'bespoke.plugins.hash' }).bundle()
    .pipe(source('bespoke-hash.js'))
    .pipe(buffer())
    .pipe(header([
      '/*!',
      ' * <%= name %> v<%= version %>',
      ' *',
      ' * Copyright <%= new Date().getFullYear() %>, <%= author.name %>',
      ' * This content is released under the <%= licenses[0].type %> license',
      ' * <%= licenses[0].url %>',
      ' */\n\n'
    ].join('\n'), pkg))
    .pipe(gulp.dest('dist'))
    .pipe(rename('bespoke-hash.min.js'))
    .pipe(uglify())
    .pipe(header([
      '/*! <%= name %> v<%= version %> ',
      '© <%= new Date().getFullYear() %> <%= author.name %>, ',
      '<%= licenses[0].type %> License */\n'
    ].join(''), pkg))
    .pipe(gulp.dest('dist'));
});
