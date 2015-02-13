'use strict';

module.exports = function (grunt) {

  var targetPort = 9000,
      targetHost = (process.platform === 'win32') ? 'localhost' : '0.0.0.0';

  grunt.initConfig({

    connect: {
      options: {
        port: 9000,
        hostname: '*',
        livereload: 35729
      },
      livereload: {
        options: {
          open: {
            target: 'http://' + targetHost + ':' + targetPort
          }
        }
      }
    },

    watch: {
      options: {
        livereload: '<%= connect.options.livereload %>'
      },
      livereload: {
        files: ['example/**/*', 'index.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('serve', [
    'connect:livereload',
    'watch'
  ]);
};