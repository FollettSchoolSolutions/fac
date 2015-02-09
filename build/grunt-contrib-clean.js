'use strict';

// Empties folders to start fresh
module.exports = function(grunt) {
  grunt.config.set('clean', {
    dist: {
      files: [{
        dot: true,
        src: [
          '<%= dist %>/*'
        ]
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
};