(function (angular) {

  'use strict';

  angular.module('directives.loading', [])

    .directive('fssLoading', [function () {
      return {
        restrict: 'A',
        replace: false,
        scope: { text: '@' },
        template: '{{ text }} <span class="dot-loading">' +
                  '  <span class="dot dot_1"></span>' +
                  '  <span class="dot dot_2"></span>' +
                  '  <span class="dot dot_3"></span>' +
                  '</span>'
      };
    }]);

}(angular));