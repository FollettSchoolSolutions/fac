'use strict';

module.exports = function(grunt) {
  grunt.config.set('cssmin', {
    all: {
      files: {
        'dist/fac-<%= properties.version %>.min.css': ['<%= concat.styles.dest %>']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};