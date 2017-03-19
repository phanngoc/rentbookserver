var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var babel = require('babel-register');
var env = require('gulp-env'); // set enviroment


gulp.task('default', function () {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {'NODE_ENV': 'development'},
        ignore: ['./node_modules/**']
    }).on('restart', function () {
        console.log('Restarting ....')
    });
});
