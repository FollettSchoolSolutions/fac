'use strict';

module.exports = function (grunt) {

  var properties = grunt.file.readJSON('properties.json');

  grunt.config.set('properties', properties);

  console.log(properties.version);

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
