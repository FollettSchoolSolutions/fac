(function (angular) {

  'use strict';

  angular.module('fss.directives.highlightonclick', [])

    .directive('fssHighlightOnClick', [function () {
      return {
        link: function ($scope, element) {
          element.bind('click', function () {
            element[0].setSelectionRange(0, 999);
          });
        }
      };
    }]);

}(angular));