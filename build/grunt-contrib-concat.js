'use strict';

module.exports = function(grunt) {
  grunt.config.set('concat', {
    scripts: {
      src: ['src/**/*.js', '.tmp/templates.js', '!src/**/test/**', '!src/**/*Spec.js'],
      dest: 'dist/fac-<%= properties.version %>.js'
    },
    styles: {
      src: ['resources/*.css'],
      dest: 'dist/fac-<%= properties.version %>.css'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};