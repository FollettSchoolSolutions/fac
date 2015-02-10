'use strict';

// Empties folders to start fresh
module.exports = function(grunt) {
  grunt.config.set('clean', {
    dist: 'dist',
    tmp: '.tmp'
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};