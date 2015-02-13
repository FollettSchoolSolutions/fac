'use strict';

// create javascript templates from html
module.exports = function(grunt) {
  grunt.config.set('ngtemplates', {
    app: {
      src: 'src/**/*.html',
      dest: '.tmp/templates.js',
      options: {
        module: 'fac',
        url: function(url) {
          return url.replace('src/', '');
        },
        standalone: false,
        htmlmin: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-angular-templates');
};
