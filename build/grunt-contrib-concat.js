'use strict';

module.exports = function(grunt) {
  grunt.config.set('concat', {
    componenets: {
      src: ['src/**/*.js', '!src/**/test/**', '!src/**/*Spec.js'],
      dest: 'dist/follett-angular-components.js'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};