// Generated on 2014-11-11 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.loadTasks('build');

  grunt.registerTask('build', [
    'clean',
    'ngtemplates',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('test', [
    'karma:unit'
  ]);

  //for debugging tests
  grunt.registerTask('debug', [
    'karma:dev'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'karma:unit'
  ]);
};
