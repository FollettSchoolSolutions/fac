'use strict';

module.exports = function(grunt) {
  grunt.config.set('concat', {
    scripts: {
      src: ['src/**/*.js', '.tmp/templates.js', '!src/**/test/**', '!src/**/*Spec.js'],
      dest: 'dist/follett-angular-components.js'
    },
    styles: {
      src: ['resources/*.css'],
      dest: 'dist/follett-angular-components.css'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};