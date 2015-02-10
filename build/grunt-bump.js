'use strict';

module.exports = function(grunt) {
  grunt.config.set('bump', {
    options: {
      files: ['package.json', 'bower.json'],
      commitFiles: ['package.json', 'bower.json'],
      pushTo: 'origin'
    }
  });

  grunt.loadNpmTasks('grunt-bump');
};