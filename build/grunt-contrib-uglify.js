'use strict';

module.exports = function(grunt) {

  grunt.config.set('uglify', {
    all: {
      files: {
        'dist/follett-angular-components.min.js': ['dist/follett-angular-components.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
