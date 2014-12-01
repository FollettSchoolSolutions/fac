'use strict';

// Test settings
module.exports = function(grunt) {
  grunt.config.set('karma', {
    unit: {
      configFile: 'karma.conf.js',
      singleRun: true
    },
    dev: {
      configFile: 'karma.conf.js',
      singleRun: false,
      autoWatch: true,
      browsers: ['Chrome']
    }
  });

  grunt.loadNpmTasks('grunt-karma');
};
