(function (angular) {
  'use strict';

  angular.module('fac', [
    'fss.directives.bargraph',
    'fss.directives.dateinput',
    'fss.directives.delayedchange',
    'fss.directives.focus',
    'fss.directives.hidekeyboardonsubmit',
    'fss.directives.highlightonclick',
    'fss.directives.loading',
    'fss.directives.sanitize',
    'fss.directives.scrollto',
    'fss.filters.truncate',
    'fss.services.analytics',
    'fss.services.datetime',
    'fss.services.fssapi'
  ]);
}(angular));