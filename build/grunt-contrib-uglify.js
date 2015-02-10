'use strict';

module.exports = function(grunt) {

  grunt.config.set('uglify', {
    all: {
      files: {
        'dist/fac-<%= properties.version %>.min.js': ['<%= concat.scripts.dest %>']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
