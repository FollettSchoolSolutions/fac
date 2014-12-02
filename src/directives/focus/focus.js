(function (angular) {

  'use strict';

  angular.module('directives.focus', [])

    .directive('fssFocus', ['$timeout', function($timeout) {
      return {
        scope : {
          trigger : '@fssFocus'
        },
        link : function(scope, element) {
          scope.$watch('trigger', function(value) {
            if (value === 'true') {
              $timeout(function() {
                element[0].focus();
              });
            }
          });
        }
      };
    }]);

}(angular));
