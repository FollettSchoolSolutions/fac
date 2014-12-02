'use strict';

// Make sure code styles are up to par and there are no obvious mistakes
module.exports = function(grunt) {
  grunt.config.set('jshint', {
    options: {
      jshintrc: '.jshintrc',
      reporter: require('jshint-stylish')
    },
    all: [
      'Gruntfile.js',
      'build/*.js',
      'src/**/*.js',
      '!src/**/*Spec.js'
    ],
    test: {
      options: {
        jshintrc: 'test/.jshintrc'
      },
      src: ['src/**/*Spec.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
