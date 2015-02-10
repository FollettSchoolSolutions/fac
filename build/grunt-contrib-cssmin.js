'use strict';

module.exports = function(grunt) {
  grunt.config.set('cssmin', {
    all: {
      files: {
        'dist/follett-angular-components.min.css': ['dist/follett-angular-components.css']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};