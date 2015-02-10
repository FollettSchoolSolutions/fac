'use strict';

module.exports = function(grunt) {
  grunt.config.set('bump', {
    options: {
      files: ['package.json', 'bower.json']
    }
  });

  grunt.loadNpmTasks('grunt-bump');
};