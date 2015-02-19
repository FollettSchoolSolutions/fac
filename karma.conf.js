// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
'use strict';

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    plugins: ['karma-jasmine',
              'karma-phantomjs-launcher',
              'karma-chrome-launcher',
              'karma-spec-reporter',
              'karma-junit-reporter',
              'karma-ng-html2js-preprocessor'],

    preprocessors: {
      'src/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      stripPrefix: 'src/'
    },

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/modernizr/modernizr.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-momentjs/angular-momentjs.js',
      'bower_components/ng-file-upload/angular-file-upload-all.js',
      'src/**/*.js',
      'src/**/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8180,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // Capture results
    reporters: ['spec', 'junit'],
    specReporter: {
      suppressPassed: false,
      suppressFailed: false,
      suppressSkipped: true
    },

    //junit report config
    junitReporter: {
      outputFile: 'js-test-results.xml',
      suite: ''
    }
  });
};
