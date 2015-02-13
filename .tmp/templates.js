angular.module('fac').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('directives/dateshim/dateshim.html',
    "<div data-ng-show=\"pickerSupported\"> <input name=\"dateShimNativePicker\" type=\"date\" placeholder=\"mm/dd/yyyy\" data-ng-model=\"clean.text\"> </div> <div data-ng-show=\"!pickerSupported\"> <input name=\"dateShimTextOnly\" type=\"text\" placeholder=\"mm/dd/yyyy\" data-ng-model=\"unclean.text\"> </div>"
  );

}]);
